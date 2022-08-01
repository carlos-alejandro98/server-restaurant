const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const solicitudProductoSchema = new mongoose.Schema(
  {
    usuario: {
        type: ObjectId,
        ref: "User",
    },
    typeProduct: {
      type: Array
    },
    cantidad: {
        type: Number,
        required: true
    },
    pmp:{
        type: Number,
        required: true
    },
    fechaSolicitud: {
        type: Date,
        require: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SolicitudProducto", solicitudProductoSchema);