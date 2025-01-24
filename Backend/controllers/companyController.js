const SignUp = require('../models/Company')
const nodemailer = require("nodemailer");
const cron = require('node-cron');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})
// Get all
const getAll = async (req, res) => {

    try {
        const userData = await SignUp.find({ id: req.body.id }).sort({ createdAt: -1 });
        // console.log(userData)
        // const employee = await SignUp.find().sort({ createdAt: -1 });
        res.send({ message: 'Getting all company detail', status: 200, userData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getById = async (req, res) => {
    try {
        const employee = await SignUp.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ employee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Create a new employee
const createemployee = async (req, res) => {
    try {
        const { name, email } = req.body;
        const existingCompany = await SignUp.findOne({ company_email: email });
        if (existingCompany) {
            return res.status(409).json({ message: 'Company already exists' });
        }

        const newCompany = new SignUp({ company_name: name, company_email: email, active: true });
        await newCompany.save();
        res.status(201).json({ message: 'Company created successfully', newCompany });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




// Function to send individual emails
const sendmail = async (name, email, userId) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Application for Developer Position",
            html: `
                <p>Hello,</p>
                <p>I hope this message finds you well...</p>
                <p>I am writing to express my keen interest in any available Frontend or Backend development positions within your esteemed organization. As a Computer Science Engineering Graduate (YOP-2022), I am thrilled to explore opportunities in the software development field and leverage my skills to contribute to the growth of your company.</p>
                <p>As my background in Computer Science Engineering, my passion for programming has equipped me with the necessary skills in software development. I am proficient in several programming languages, including Java, SQL, HTML, CSS, JavaScript, ReactJS, NodeJs, MongoDb that I have learned during Full Stack Development course at JSpiders, located in BTM, Bangalore, which I believe will bring great value to your company.</p>

                <p>I am specially interested in the Fullstack Developer Position but I can adopt myself in other domain also. For your convenience, I have attached my resume, which highlights my educational qualifications and technical skills. </p>

                <p>Thank you for considering my application. I eagerly await your response and the opportunity to further demonstrate my suitability for the role.</p>

                <p>Sincerely,</p>
                <p>Keshab Mahanta </p>
                <p>Website - https://keshabmahanta-portfolio.web.app/</p>

                <table style="font-family: Arial, sans-serif; font-size: 14px; color: #333; width: 100%; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px;">
                    <tr>
                        <td colspan="2" style="font-size: 18px; font-weight: bold; color: #000;">
                            KESHAB MAHANTA
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="font-size: 16px; color: #555;">
                            FULL STACK DEVELOPER
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 50%; padding-top: 5px;">
                            <strong>Contact:</strong> 7063112560 / 6297121992<br />
                        </td>
                    </tr>
                    <tr>
                     <td style="width: 50%; padding-top: 5px;">
                            <strong>Address:</strong> Keshab Mahanta, 14, 13th Cross Rd, Mico Layout, BTM 2nd Stage, BTM Layout, 560076
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-top: 10px;">
                            <a href="https://keshabmahanta-portfolio.web.app/" target="_blank" style="text-decoration: none; color: #0073e6;">keshabmahanta-portfolio.web.app</a>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-top: 10px;">
                            <a href="https://www.linkedin.com/in/keshab-mahanta" target="_blank" style="text-decoration: none; margin-right: 15px;">
                                <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="20" style="vertical-align: middle;" /> LinkedIn
                            </a>
                            <a href="https://github.com/keshabmahanta" target="_blank" style="text-decoration: none;">
                                <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" width="20" style="vertical-align: middle;" /> GitHub
                            </a>
                        </td>
                    </tr>
                </table>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        if (info.rejected.length > 0) {
            throw new Error(`Email rejected for ${email}`);
        }

        console.log('Message sent successfully:', info.response);
        return { status: 'success', email };
    } catch (error) {
        console.error(`Error occurred while sending email to ${email}: ${error.message}`);
        throw new Error(error.message);
    }
};



// Scheduler to send emails every minute
const sendReport = async (report) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: process.env.EMAIL, // Your email address
            subject: 'Email Scheduler Report',
            html: `<p>Hello,</p>
                   <p>The email scheduler has completed sending emails. Below is the summary:</p>
                   <pre>${report}</pre>
                   <p>Best regards,<br>Email Scheduler</p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log('Report sent successfully.');
    } catch (error) {
        console.error('Error sending report:', error.message);
    }
};

// Cron job to run in every 2 days 30 11 */2 * *
cron.schedule('30 11 */2 * *', async () => {
    console.log('Running email scheduler...');

    try {
        // Fetch all active users
        const activeUsers = await SignUp.find({ active: true });

        if (activeUsers.length === 0) {
            console.log('No active users found.');
            return;
        }

        let report = 'Email Sending Report:\n\n';
        let successCount = 0;
        let failureCount = 0;

        // Send emails to all active users
        for (const user of activeUsers) {
            const { company_name: name, company_email: email, _id: userId } = user;

            try {
                await sendmail(name, email, userId);
                report += `✔️ Success: ${name} (${email})\n`;
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to send email to ${name} (${email}):`, error.message);
                report += `❌ Failed: ${name} (${email}) - ${error.message}\n`;
                failureCount++;
            }
        }

        // Append summary to the report
        report += `\nSummary:\n- Total Emails Sent: ${activeUsers.length}\n- Successful Sends: ${successCount}\n- Failed Sends: ${failureCount}`;

        // Send report to yourself
        await sendReport(report);
    } catch (error) {
        console.error('Error in email scheduler:', error.message);
    }
});

// Delete an employee by ID
const updateActiveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await SignUp.findById(id);

        if (!employee) {
            return res.status(404).json({ message: 'Company not found' });
        }

        employee.active = !employee.active; // Toggle the active status
        await employee.save();

        res.status(200).json({ message: 'Company status updated successfully', employee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update employee details
const updateEmployeeDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { company_name, company_email } = req.body;

        // Validate the input
        if (!company_name || !company_email) {
            return res.status(400).json({ message: 'Company name and email are required' });
        }

        // Find the employee by ID and update details
        const updatedEmployee = await SignUp.findByIdAndUpdate(
            id,
            { company_name, company_email },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({
            message: 'Employee details updated successfully',
            updatedEmployee,
        });
    } catch (error) {
        console.error('Error updating employee details:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getAll, getById, createemployee, updateActiveStatus, updateEmployeeDetails }