const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, addressLine1, addressLine2, city, state, zipCode, role } = req.body;
        const file = req.file;

        if (!email || !password) {
            return res.status(400).json({ message: "Email & password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
            role: role || "customer",
            profilePicture: file ? file.path : undefined,
        });

        res.status(201).json({
            message: "Account registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                profilePicture: newUser.profilePicture,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email & password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= LOGOUT ================= */
exports.logout = async (req, res) => {
    try {
        // JWT logout handled client-side: token deletion
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


/* ================= UPDATE PROFILE ================= */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // JWT middleware should set req.user
        const file = req.file;
        const {
            name,
            email,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            zipCode,
        } = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Update fields (only if provided)
        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (addressLine1) user.addressLine1 = addressLine1;
        if (addressLine2) user.addressLine2 = addressLine2;
        if (city) user.city = city;
        if (state) user.state = state;
        if (zipCode) user.zipCode = zipCode;

        if (file) {
            user.profilePicture = file.path; // multer should save file path
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                addressLine1: user.addressLine1,
                addressLine2: user.addressLine2,
                city: user.city,
                state: user.state,
                zipCode: user.zipCode,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};