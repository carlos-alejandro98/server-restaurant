const mongoose = require("mongoose");

const tipoProductoSchema = new mongoose.Schema(
  {
    tipoProducto: {
        type: String,
        trim: true,
        required: "Tipo de producto es obligatorio",
        minlength: [2, "Demasiado Corto"],
        maxlength: [32, "Demasiado Largo"],
    },
    identificador: {
        type: String,
        trim: true,
        required: "Identificador es obligatorio",
        minlength: [2, "Demasiado Corto"],
        maxlength: [32, "Demasiado Largo"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    status: {
        type: String,
        default: "Active",
        enum: ["Active", "Inactive"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TipoProducto", tipoProductoSchema);
