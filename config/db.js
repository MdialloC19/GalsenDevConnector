const mongoose = require("mongoose");
const User = require("../models/User");
const Profile = require("../models/Profile");
const config = require("config");
require("dotenv").config();

const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URI);
    await mongoose.connect(db);
    console.log("MongoDB connected...");
  } catch (error) {
    console.log(error.message);

    process.exit(1);
  }
};

/**
 * Creates profiles for all users in the database.
 *
 * @async
 * @function
 * @throws {Error} An error if there is an issue during profile creation.
 *
 * @example
 * // Example of usage
 * createProfileForUsers();
 */
async function createProfileForUsers() {
  try {
    // Retrieve all users
    const users = await User.find();

    // For each user, create an associated profile
    for (const user of users) {
      const profileFields = {
        user: user._id, // ID of the associated user
      };

      // Create the associated profile
      const profile = new Profile(profileFields);

      // Save the profile to the database
      await profile.save();

      console.log(`Profile created for user ${user._id}`);
    }

    console.log("Process completed.");
  } catch (error) {
    console.error("Error during profile creation:", error);
  } finally {
    mongoose.disconnect();
  }
}

async function updateAllUsers(updateFields) {
  try {
    const users = await Profile.find({});

    for (const user of users) {
      Object.keys(updateFields).forEach((field) => {
        if (
          user.experience[field] === undefined ||
          user.education[field] === undefined
        ) {
          user.experience[field] = updateFields[field];
          user.education[field] = updateFields[field];
          console.log(user.experience);
        }
      });
    }
    await Promise.all(users.map((user) => user.save()));
    console.log("Document update completed.");
  } catch (error) {
    console.error("Error during document update:", error);
    throw error;
  } finally {
    mongoose.disconnect();
  }
}

const updateFields = {
  // previousPassword: [String],
  isDeleted: {
    type: Boolean,
    default: false,
  },
};
// updateAllUsers(updateFields);

// Use the function to create profiles for all users
// createProfileForUsers();

module.exports = connectDB;
