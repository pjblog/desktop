import { defineController } from "@pjblog/control";
import { Login } from "../component/Login";

export default defineController<never, 'redirect_url'>(() => <Login />);