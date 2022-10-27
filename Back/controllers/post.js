const Post = require("../models/post");
const fs = require("fs");
const { db } = require("../models/post");
const { default: mongoose } = require("mongoose");

exports.getOnePost = (req, res, next) => {
	Post.findOne({ _id: req.params.id })

		.then((post) => res.status(200).json(post))
		.catch((error) => res.status(404).json({ error: error }));
};

exports.getAllPosts = (req, res, next) => {
	const page = req.params.page;
	const limit = 5;
	const skip = (page - 1) * limit;
	let userId = "1234";

	Post.aggregate([
		{ $sort: { createdAt: -1 } },
		{ $skip: skip },
		{ $limit: limit },
		{
			$addFields: {
				userIdObject: {
					$toObjectId: "$userId",
				},
			},
		},
		{ $lookup: { from: "users", localField: "userIdObject", foreignField: "_id", as: "user" } },
		{ $unwind: "$user" },
	])
		.then((posts) => res.status(200).json(posts))
		.catch((error) => res.status(400).json({ error: error }));
};

exports.createPost = (req, res, next) => {
	const postObject = req.body;
	console.log(postObject);
	delete postObject._id;
	const post = new Post({
		userId: req.auth.userId,
		content: postObject.content,
		imageUrl: req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : null,
	});
	post
		.save()
		.then((data) => res.send(data._id))
		.catch((error) => res.status(400).json({ error: error }));
};

exports.modifyPost = (req, res, next) => {
	Post.findOne({ _id: req.params.id })
		.then((post) => {
			if (post.userId !== req.auth.userId) {
				return res.status(403).json({
					error: "Vous n'avez pas le droit de modifier ce post !",
				});
			} else {
				if (req.file) {
					if (post.imageUrl !== null) {
						const filename = post.imageUrl.split("/images/")[1];
						fs.unlink(`images/${filename}`, () => {
							console.log("Image supprimée");
						});
					}
					Post.updateOne(
						{ _id: req.params.id },
						{
							content: req.body.content,
							_userId: req.auth.userId,
							imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
						}
					)
						.then(() => res.status(200).json({ message: "Post mis à jour !" }))
						.catch((error) => res.status(400).json({ 2: error }));
				} else {
					Post.updateOne(
						{ _id: req.params.id },
						{
							content: req.body.content,
							_userId: req.auth.userId,
						}
					)
						.then(() => res.status(200).json({ message: "Post mis à jour !" }))
						.catch((error) => res.status(400).json({ 1: error }));
				}
			}
		})
		.catch((error) => res.status(400).json({ 2: error }));
};

exports.deletePost = (req, res, next) => {
	Post.findOne({ _id: req.params.id })
		.then((post) => {
			if (req.auth.role !== "admin" && post.userId !== req.auth.userId) {
				return res.status(403).json({
					error: "Vous n'avez pas le droit de supprimer ce post !",
				});
			} else {
				if (post.imageUrl !== null) {
					const filename = post.imageUrl.split("/images/")[1];
					fs.unlink(`images/${filename}`, () => {
						Post.deleteOne({ _id: req.params.id })
							.then(() => res.status(200).json({ message: "Post supprimé !" }))
							.catch((error) => res.status(400).json({ error }));
					});
				} else {
					Post.deleteOne({ _id: req.params.id })
						.then(() => res.status(200).json({ message: "Post supprimé !" }))
						.catch((error) => res.status(400).json({ error }));
				}
			}
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.likePost = (req, res, next) => {
	switch (req.body.like) {
		//if the user likes the post
		case 1:
			Post.findOne({ _id: req.params.id })
				.then((post) => {
					// Checks if the user has already liked the post
					if (post.usersLiked.includes(req.auth.userId)) {
						return res.status(400).json({ error: "Vous avez déjà liké ce post !" });
					} else {
						Post.updateOne(
							{ _id: req.params.id },
							{
								$inc: { likes: 1 },
								$push: { usersLiked: req.body.userId },
							}
						)
							.then(() => res.status(200).json({ message: "Post liké !" }))
							.catch((error) => res.status(400).json({ error }));
					}
				})
				.catch((error) => res.status(400).json({ error }));
			break;

		// if the user cancels his like
		case 0:
			Post.findOne({ _id: req.params.id })
				.then((post) => {
					// Checks if the user has already liked the post
					if (post.usersLiked.includes(req.auth.userId)) {
						Post.updateOne(
							{ _id: req.params.id },
							{
								$inc: { likes: -1 },
								$pull: { usersLiked: req.body.userId },
							}
						)
							.then(() => res.status(200).json({ message: "Like annulé !" }))
							.catch((error) => res.status(400).json({ error }));
					} else {
						return res.status(400).json({ error: "Vous n'avez pas liké ce post !" });
					}
				})
				.catch((error) => res.status(400).json({ error }));
			break;
	}
};
