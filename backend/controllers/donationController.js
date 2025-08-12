// This function tracks a donation by its ID. It is not part of the conflict.
export const trackDonationById = async (req, res) => {
  const { id } = req.params;
  try {
    const donation = await Donation.findById(id).populate("userId");
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Match a donation to an NGO request
export const matchDonationToNGORequest = async (req, res) => {
  const { id } = req.params; // donationId
  const { ngoId, requestIndex } = req.body;

  try {
    // Find the donation
    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Verify donation is in acceptable state
    if (donation.status !== "Accepted") {
      return res.status(400).json({
        message: "Donation must be in 'Accepted' status to be matched"
      });
    }

    // Find the NGO and specific request
    const ngo = await NGO.findById(ngoId);
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    const request = ngo.requestHistory[requestIndex];
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Verify item types match
    if (donation.itemType.toLowerCase() !== request.itemType.toLowerCase()) {
      return res.status(400).json({
        message: "Item types don't match between donation and request"
      });
    }

    // Verify quantities
    if (donation.quantity < request.quantity) {
      return res.status(400).json({
        message: "Donation quantity is less than requested amount"
      });
    }

    // Update donation with matching info
    donation.status = "Matched";
    donation.matchedNGO = {
      ngoId: ngo._id,
      ngoName: ngo.name,
      requestIndex: requestIndex,
      itemName: request.itemName,
      itemType: request.itemType,
      requestedQuantity: request.quantity
    };

    // Update NGO request status
    request.status = "Fulfilled";
    request.fulfilledBy = {
      donationId: donation._id,
      donorId: donation.userId,
      fulfilledAt: new Date()
    };

    await Promise.all([donation.save(), ngo.save()]);

    res.json({
      message: "Donation successfully matched to NGO request",
      donation,
      ngoRequest: request
    });

  } catch (error) {
    console.error("Matching error:", error);
    res.status(500).json({
      message: "Failed to match donation",
      error: error.message
    });
  }
};