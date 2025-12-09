import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { addUser, deleteUser, downloadManual, editUser, getUsers, updateUserRoles } from "../../controllers/v1/users.controller";
const router = Router();

router.get("/getUsers", authMiddleware, getUsers);
router.post("/addUser", authMiddleware, addUser);
router.put("/editUser", authMiddleware, editUser);
router.delete("/deleteUser/:id", authMiddleware, deleteUser);
router.get("/downloadManual", authMiddleware, downloadManual);

router.put("/updateUserRoles", authMiddleware, updateUserRoles);

export default router;
