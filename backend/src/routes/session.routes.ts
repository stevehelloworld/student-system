import { Router } from 'express';
import { createSession, getSessions, getSession, updateSession, deleteSession } from '../controllers/session.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateSessionDto, UpdateSessionDto } from '../dtos/session.dto';

const router = Router();

router.post('/', authenticate, validateDto(CreateSessionDto), createSession);
router.get('/', authenticate, getSessions);
router.get('/:id', authenticate, getSession);
router.put('/:id', authenticate, validateDto(UpdateSessionDto), updateSession);
router.delete('/:id', authenticate, deleteSession);

export default router; 