import cloudinary from '../lib/cloudinary.js';
import Notification from '../models/notification.model.js';
import Post from '../models/post.model.js';

export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: { $in: [...req.user.connections, req.user._id] },
    })
      .populate('author', 'name username profilePicture headline')
      .populate('comments.user', 'name profilePicture')
      .sort({ screatedAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error in getFeedPosts controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    let newPost;

    if (image) {
      const imgResult = await cloudinary.uploader.upload(image);
      newPost = new Post({
        author: req.user._id,
        content,
        image: imgResult.secure_url,
      });
    } else {
      newPost = new Post({
        author: req.user._id,
        content,
      });
    }

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error in createPost controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 현재 사용자가 게시물 작성자인지 확인
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You are not authorized to delete this post' });
    }

    // Cloudinary에서 이미지도 삭제
    if (post.image) {
      await cloudinary.uploader.destroy(post.image.split('/').pop().split('.')[0]);
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error in deletePost controller:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate('author', 'name username profilePicture headline')
      .populate('comments.user', 'name profilePicture username headline');

    res.status(200).json(post);
  } catch (error) {
    console.error('Error in getPostById controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: req.user._id, content } },
      },
      { new: true }
    ).populate('author', 'name email username profilePicture headline');

    // 댓글 작성자가 게시물 작성자가 아닌 경우 알림 생성
    if (post.author._id.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: 'comment',
        relatedUser: req.user._id,
        relatedPost: postId,
      });

      await newNotification.save();

      try {
        const postUrl = process.env.CLIENT_URL + '/post/' + postId;
        await sendCommentNotificationEmail(
          post.author.email,
          post.author.name,
          req.user.name,
          postUrl,
          content
        );
      } catch (error) {
        console.log('Error in sendCommentNotificationEmail:', error);
      }
    }

    res.status(200).json(post);
  } catch (error) {
    console.error('Error in createComment controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      // 게시물 좋아요 취소
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      // 게시물 좋아요 추가
      post.likes.push(userId);

      // 게시물 작성자가 좋아요를 누른 사용자가 아닌 경우 알림 생성
      if (post.author.toString() !== userId.toString()) {
        const newNotification = new Notification({
          recipient: post.author,
          type: 'like',
          relatedUser: userId,
          relatedPost: postId,
        });

        await newNotification.save();
      }
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    console.error('Error in likePost controller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
