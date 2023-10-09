import { createTransport } from "nodemailer";


const template = (user) => `

        <h2>
          Hello ${user.name}
        </h2>
        <p>
          Thank you for signing up with us. Please verify your email address by clicking the button below:
        </p>
        <a href="http://localhost:8080/verify/${user.id}" target="_blank">
          Confirm your email
        </a>
        <a href="http://localhost:8080/verify/${user.id}" target="_blank">
          http://localhost:8080/verify/${user.id}
        </a>
      
`;

const sendEmail = async (user) => {
  try {
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: "hamza@gmail.com",
        pass: "123",
      },
    });

    const info = await transporter.sendMail({
      from: 'hamza" <hamza@gmail.com>',
      to: user.email,
      subject: `${user.name} - Verify your account`,
      html: template(user),
    });

  } catch (error) {
    console.log(error);
  }
};

export default sendEmail;
