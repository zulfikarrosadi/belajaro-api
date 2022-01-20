import { Router } from 'express';
import post from '../controller/postController';

const router = Router();

router.get('/', post.getAllPost);
router.get('/:id', post.getPostById);
// router.post('/', post.addPost);

export default router;
