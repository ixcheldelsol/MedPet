const Sequelize = require('sequelize');
const db = require('../config/database');
const Usuario = require('../models/Usuario')

const Mascota = db.define('MASCOTA', {
    id_mascota: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      underscored: true
    },
    nombre: {
        type: Sequelize.STRING,
        allowNull: false
    },
    apodo: {
        type: Sequelize.STRING,
        allowNull: true
    },
    especie: {
        type: Sequelize.STRING,
        allowNull: false
    },
    raza: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sexo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    fecha_nacimiento: {
        type: Sequelize.DATE,
        allowNull: false
    },
    foto: {
        type: Sequelize.STRING,
        allowNull: true
    },
  },
  {
      timestamps: false,
      freezeTableName: true,
      tableName: 'MASCOTA',
  }
  );

// Asociación mascota pertenece a usuario 
  Mascota.associate = (models) => {
    Mascota.belongsTo(models.Usuario, {foreignKey: "id_usuario"});
  };
 


module.exports = Mascota;

