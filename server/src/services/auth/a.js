const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = '1234567';  // Make sure the password is a string

const hashPassword = async () => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(hashedPassword);
    } catch (error) {
        console.error(error);
    }
};

hashPassword();
