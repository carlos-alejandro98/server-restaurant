const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const solicitudProductoSchema = new mongoose.Schema(
  {
    usuario: {
        type: ObjectId,
        ref: "User",
        trim: true
    },
    typeProduct: {
      type: Array,
      required: true
    },
    cantidad: {
        type: Number,
        required: true,
        trim: true
    },
    pmp:{
        type: Number,
        required: true
    },
    fechaSolicitud: {
        type: Date,
        require: true
    },
    status: {
        type: String,
        default: "Solicitado",
        trim: true,
        enum: ["Solicitado", "Pendiente", "Entregado"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SolicitudProducto", solicitudProductoSchema);