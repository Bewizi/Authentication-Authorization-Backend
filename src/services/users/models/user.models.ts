import {DataTypes, Model} from "sequelize";
import databaseConfig from "../../../shared/config/database.config";

class User extends Model {
    declare id: string;
    declare firstname: string;
    declare lastname: string;
    declare email: string;
    declare password: string;
    declare verificationToken: string;
    declare isVerified: boolean;
    declare role: string;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'user',
            validate: {
                isIn: [['user', 'admin', 'moderator']]
            }
        }

    },
    {
        sequelize: databaseConfig,
        timestamps: true,
        modelName: "users",
        paranoid: true
    }
)

export default User