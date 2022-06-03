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
  is_contract_signed_by_mentee: boolean;
  is_contract_signed_by_mentor: boolean;
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
  message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  request_type: {
    type: DataTypes.ENUM(MentorMatcherRequestType.FAVORITE, MentorMatcherRequestType.MENTOR),
    defaultValue: MentorMatcherRequestType.MENTOR
  },
  status: {
    type: DataTypes.ENUM(MentorMatcherRequestStatus.SEND, MentorMatcherRequestStatus.APPROVE, MentorMatcherRequestStatus.REJECT),
    allowNull: true,
  },
  is_contract_signed_by_mentee: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_contract_signed_by_mentor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
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