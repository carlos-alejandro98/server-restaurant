const mongoose = require("mongoose");

const solicitudProductoSchema = new mongoose.Schema(
  {
    usuario: {
        type: String,
        trim: true,
        require: true
    },
    producto: {
      type: Array,
      required: true
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