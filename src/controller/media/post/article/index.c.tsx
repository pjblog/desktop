import { defineController } from "@pjblog/control";
import { LoginMiddleware } from "../../../../middleware/login";
import { AdminMiddlewaare } from "../../../../middleware/admin";
import { ArticleEditor } from "../../editor/article";

export default defineController(LoginMiddleware, AdminMiddlewaare, () => <ArticleEditor />)