const mongoose = require("mongoose");

const solicitudProductoSchema = new mongoose.Schema(
  {
    idProduct: {
      type: String,
      ref: "Producto",
    },
    user: {
        type: String,
        trim: true,
        require: true
    },
    product: {
      type: String,
      required: true
    },
    count: {
        type: Number,
        required: true,
        trim: true
    },
    pmp:{
        type: Number,
        required: true
    },
    dateRequest: {
        type: Date,
        require: true
    },
    imageUrl: {
      type: String,
      trim: true,
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