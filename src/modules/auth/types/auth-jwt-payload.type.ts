export type AuthJwtPayload = {
  userID: number;
  email: string;
  role: {
    roleID: number;
    roleName: string;
  };
};
