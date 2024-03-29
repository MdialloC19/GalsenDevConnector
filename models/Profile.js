const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  experience: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const skipDeleted = function () {
  this.where({ isDeleted: false });
  this.where("comments.isDeleted").equals(false);
};

ProfileSchema.pre("find", skipDeleted);
ProfileSchema.pre("findOne", skipDeleted);
ProfileSchema.pre("findById", skipDeleted);
ProfileSchema.pre("updateOne", skipDeleted);
ProfileSchema.pre("updateMany", skipDeleted);
ProfileSchema.pre("findOneAndUpdate", skipDeleted);
ProfileSchema.pre("deleteOne", skipDeleted);
ProfileSchema.pre("deleteMany", skipDeleted);

// const commonPrefixes = /^(find|delete|update)/;

// Object.keys(ProfileSchema.methods).forEach((methodName) => {
//   if (commonPrefixes.test(methodName)) {
//     ProfileSchema.pre(methodName, skipDeleted);
//   }
// });

module.exports = mongoose.model("profile", ProfileSchema);
