const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
  },
  text: {
    type: String,
    required: [true, "Please give the text to post"],
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const skipDeleted = function () {
  this.where({ isDeleted: false });
  // this.find({ "comments.isDeleted": { $ne: false } });
  this.where("comments.isDeleted").equals(false);
};

PostSchema.pre("find", skipDeleted);
PostSchema.pre("findOne", skipDeleted);
PostSchema.pre("findById", skipDeleted);
PostSchema.pre("updateOne", skipDeleted);
PostSchema.pre("updateMany", skipDeleted);
PostSchema.pre("findOneAndUpdate", skipDeleted);
PostSchema.pre("deleteOne", skipDeleted);
PostSchema.pre("deleteMany", skipDeleted);
// const commonPrefixes = /^(find|delete|update)/;

// Object.keys(PostSchema.statics).forEach((methodName) => {
//   if (commonPrefixes.test(methodName)) {
//     PostSchema.pre(methodName, skipDeleted);
//   }
// });

module.exports = mongoose.model("post", PostSchema);
