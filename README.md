### **GoodsForGood**

**Project Description**

GoodsForGood is a full-stack web application designed to manage non-monetary donations. It serves as a digital interface that connects donors and NGOs, streamlining the process of donation submission, review and allocation. This repository contains the complete codebase, including both the backend API and the frontend user interface.

-----

### **Core Features**

  * **User Registration & Login:** Donors can securely register and log in to submit donations.
  * **Donation Submission:** Donors can submit details and upload images of items they wish to donate.
  * **NGO Management:** Admins can manage NGO accounts, which can then log in to request items.
  * **Donation Allocation:** The system allows for donations to be allocated to specific NGOs based on their needs.
  * **Email Notifications:** Automated email alerts are sent to both donors and NGOs when a donation is allocated.
  * **Status Tracking:** The status of each donation is tracked from submission to delivery.
  * **Frontend Interface:** A user-friendly interface is provided for donors, NGOs and admins to interact with the system.

-----

### **Tech Stack**

  * **Frontend:** HTML, CSS, JavaScript 
  * **Backend:** Node.js, Express.js
  * **Database:** MongoDB
  * **ODM:** Mongoose
  * **Image Upload:** Multer
  * **Email Service:** Nodemailer
  * **Environment Variables:** dotenv

-----

### **API Endpoints**

| Method | Endpoint                                   | Description                                      |
| :----- | :----------------------------------------- | :----------------------------------------------- |
| `POST` | `/api/users/register`                      | Registers a new donor user.                      |
| `POST` | `/api/donations/donate`                    | Submits a new donation with an image.            |
| `PUT`  | `/api/donations/:id/track`                 | Updates a donation's status to "Submitted."      |
| `POST` | `/api/ngos/allocate`                       | Allocates a donation to an NGO and sends emails. |
| `POST` | `/api/ngos/register`                       | Registers an NGO (admin-only).                   |
| `POST` | `/api/ngos/login`                          | Logs in an NGO.                                  |

-----

### **Team**

  * Nudaa Deshmukh
  * Renuka Bais
  * Nidhi Chaphale
  * Aanchal Rathi
