const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const sendEmail = require("../utils/sendEmail.js");


// contact
exports.Contact = catchAsyncErrors(async (req, res, next) => {
  const { full_name, phoneNo, email, message } =
    req.body;

  if (
    !full_name ||
    !phoneNo ||
    !email ||
    !message
  )
    return next(new ErrorHandler("Please enter all details", 400));


  const emailMessage = `Dear Nishant,
  I hope this email finds you well.

  I wanted to bring to your attention that we've received a new message request from a user. Below are the details:
  
  Name: ${full_name}
  Email: ${email}
  Phone Number: ${phoneNo}
  Message: ${message}

  Please take necessary action and reach out to the user at your earliest convenience.
  
  Thank you for your attention to this matter.
  
  Best regards,
  Java Sports Team 🏅
  `;

  const adminEmail = "nishant.ranjan1984@gmail.com";

  await sendEmail(adminEmail, "Message Request", emailMessage);

  res.status(201).json({
    success: true,
    message: "Thank You for contacting US",
  });
});
