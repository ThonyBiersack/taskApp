import mongoose from "mongoose";

const koneksi = async () => {
    try {
        const nyambung = mongoose.connect(process.env.URI);
        if (!nyambung) {
            console.log("database gagal konek");
        } else {
            console.log("database konek");
        }
    } catch (error) {
        console.log(error);
    }
};

export default koneksi;