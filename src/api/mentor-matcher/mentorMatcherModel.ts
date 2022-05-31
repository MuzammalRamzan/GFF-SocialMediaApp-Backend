import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../database";
import { User } from "../user/userModel";

export enum MentorMatcherRequestStatus {
  SEND = "send",
  APPROVE = "approve",
  REJECT = "reject"
}

export enum MentorMatcherRequestType {
  FAVORITE = "favorite",
  MENTOR = "mentor"
}

export interface IMentorMatcher {
  id: number;
  mentor_id: number;
  mentee_id: number;
  request_type: MentorMatcherRequestType;
  status: MentorMatcherRequestStatus;
}

export class MentorMatcherModel extends Model { };

MentorMatcherModel.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  mentor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  mentee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  request_type: {
    type: DataTypes.ENUM(MentorMatcherRequestType.FAVORITE, MentorMatcherRequestType.MENTOR),
    defaultValue: MentorMatcherRequestType.MENTOR
  },
  status: {
    type: DataTypes.ENUM(MentorMatcherRequestStatus.SEND, MentorMatcherRequestStatus.APPROVE, MentorMatcherRequestStatus.REJECT),
    allowNull: true,
  }
}, {
  sequelize: sequelize,
  tableName: "mentor_matcher"
})

MentorMatcherModel.belongsTo(User, {
  foreignKey: "mentor_id",
  as: 'mentor'
});

MentorMatcherModel.belongsTo(User, {
  foreignKey: "mentee_id",
  as: 'mentee'
});

MentorMatcherModel.sync();