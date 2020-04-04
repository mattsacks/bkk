import { UserState } from "lib/types";
import { createGlobal } from "lib/useGlobalState";

const withUser = createGlobal<UserState>("user");
export default withUser;
