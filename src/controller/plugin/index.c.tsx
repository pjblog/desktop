import { defineController } from "@pjblog/control";
import { LoginMiddleware } from "../../middleware/login";
import { Layout } from "../../component/Layout";
import { AdminMiddlewaare } from "../../middleware/admin";

export default defineController(LoginMiddleware, AdminMiddlewaare, Layout, () => {
  return <div>plugin</div>
})