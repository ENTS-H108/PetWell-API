const mongoose = require('mongoose');
const Doctor = require('../models/doctorModel');
const Schedule = require('../models/scheduleModel');
const WorkHour = require('../models/workHourModel');

// CRUD Dokter
exports.createDoctor = async (req, res) => {
    const { name, type, profpict, profile, experiences, year, lat, long, price, hospital } = req.body;

    const doctor = await Doctor.create({
        name,
        type,
        profpict,
        profile,
        experiences,
        year,
        lat,
        long,
        price,
        hospital
    })
    console.log("Dokter berhasil ditambahkan:", doctor);

    const { __v, ...doctorData } = doctor.toObject();

    try {
        res.status(201).json({ error: false, message: "Dokter berhasil ditambahkan", ...doctorData });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan dokter: ', error });
    }
};

exports.getDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({}).select('-__v');

        if (doctors.length === 0) {
            return res.status(404).json({
                error: true,
                message: "List dokter masih kosong",
            });
        }
        res.status(200).json({
            error: false,
            message: "List dokter berhasil diambil",
            doctors,
        });
    } catch (error) {
        res.status(500).json({ error: true, message: err.message });
    }
};

exports.getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select('-__v');
        if (!doctor) {
            return res.status(404).json({ message: "Dokter tidak ditemukan" });
        }
        res.status(200).json(doctor);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, profpict, profile, experiences, year, lat, long, price, hospital } = req.body;
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            { name, type, profpict, profile, experiences, year, lat, long, price, hospital },
            { new: true }
        ).select('-__v');
        if (!updatedDoctor) {
            return res.status(404).json({ message: "Dokter tidak ditemukan" });
        }
        res.status(200).json({ error: false, message: "Dokter berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!deletedDoctor) {
            return res.status(404).json({ message: "Dokter tidak ditemukan" });
        }
        res.json({ message: "Dokter berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ error: true, message: err.message });
    }
};



//CRUD Schedule
exports.createSchedule = async (req, res) => {
    try {
        const { doctorId, date } = req.body;
        const newSchedule = await Schedule.create({
            doctorId: doctorId,
            date: date
        });
        const { __v, ...scheduleData } = newSchedule.toObject();

        res.status(201).json({ error: false, message: "Jadwal berhasil ditambahkan", ...scheduleData });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

exports.getSchedules = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const schedules = await Schedule.find({ doctorId }).select('-__v');
        if (schedules.length === 0 || !schedules) {
            return res.status(404).json({
                error: true,
                message: "Jadwal masih kosong",
            });
        }
        res.status(200).json({
            error: false,
            message: "List jadwal berhasil diambil",
            schedules,
        });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

exports.updateSchedule = async (req, res) => {
    const { date } = req.body;
    const { id } = req.params;

    try {
        const updatedSchedule = await Schedule.findByIdAndUpdate(
            id,
            { date: date },
            { new: true }
        ).select('-__v');
        if (!updatedSchedule) {
            return res.status(404).json({ message: "Jadwal tidak ditemukan" });
        }
        res.status(200).json({ error: false, message: "Jadwal berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

exports.deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSchedule = await Schedule.findByIdAndDelete(id);
        if (!deletedSchedule) {
            return res.status(404).json({ message: "Jadwal tidak ditemukan" });
        }
        res.status(200).json({ error: false, message: "Jadwal berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

//CRUD Work Hour
exports.createWorkHour = async (req, res) => {
    try {
        const { scheduleId, availSlot } = req.body;
        const newWorkHour = await WorkHour.create({
            scheduleId: scheduleId,
            availSlot: availSlot
        });
        const { __v, ...workHourData } = newWorkHour.toObject();

        res.status(201).json({ error: false, message: "Jadwal berhasil ditambahkan", ...workHourData });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

exports.getWorkHours = async (req, res) => {
    try {
        const scheduleId = req.params.id;
        const workHours = await WorkHour.find({ scheduleId }).select('-__v');
        if (workHours.length === 0 || !workHours) {
            return res.status(404).json({
                error: true,
                message: "Jam kerja masih kosong",
            });
        }
        res.status(200).json({
            error: false,
            message: "List jam kerja berhasil diambil",
            workHours,
        });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

exports.updateWorkHour = async (req, res) => {
    const { availSlot } = req.body;
    const { id } = req.params;

    try {
        const updatedWorkHour = await WorkHour.findByIdAndUpdate(
            id,
            { availSlot: availSlot },
            { new: true }
        ).select('-__v');
        if (!updatedWorkHour) {
            return res.status(404).json({ message: "Jam kerja tidak ditemukan" });
        }
        res.status(200).json({ error: false, message: "Jam kerja berhasil diperbarui" });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

exports.deleteWorkHour = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedWorkHour = await WorkHour.findByIdAndDelete(id);
        if (!deletedWorkHour) {
            return res.status(404).json({ message: "Jam kerja tidak ditemukan" });
        }
        res.status(200).json({ error: false, message: "Jam kerja berhasil dihapus" });
    } catch (err) {
        res.status(500).json({ error: true, message: err.message });
    }
};

// Fitur appointment
exports.listAppointment = async (req, res) => {
    try {
        const { userId } = req.user;

        const doctors = await Doctor.find({ userId });

        const doctorList = doctors.map(doctor => ({
            id: doctor._id,
            name: doctor.name,
            type: doctor.type,
            hospital: doctor.hospital,
            lat: doctor.lat,
            long: doctor.long,
            price: doctor.price,
        }));

        res.status(200).json(doctorList);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil list dokter', error });
    }
};


exports.getAppointmentDetails = async (req, res) => {
    try {
        const { doctorId } = req.query;

        const doctor = await Doctor.findById(doctorId).select("name type hospital price profile experiences").exec();
        if (!doctor) {
            return res.status(404).json({ message: "Dokter tidak ditemukan" });
        }

        const schedules = await Schedule.find({ doctorId }).select("-__v");
        if (!schedules) {
            return res.status(404).json({ message: "Tidak ada jadwal yang tersedia" });
        }

        const schedulesWithWorkHours = await Promise.all(schedules.map(async (schedule) => {
            const workHours = await WorkHour.find({ scheduleId: schedule._id }).select("availSlot isAvail");
            const workHoursWithId = workHours.map(workHour => ({
                workHourId: workHour._id,
                availSlot: workHour.availSlot,
                isAvail: workHour.isAvail
            }));

            return {
                scheduleId: schedule._id,
                date: schedule.date,
                workHours: workHoursWithId
            };
        }));

        const response = {
            doctor: doctor.toObject(),
            schedules: schedulesWithWorkHours
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error during fetching schedules and work hours", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAppointmentSummary = async (req, res) => {
    try {
        const { doctorId, scheduleId, workHourId } = req.query;

        const { email, username } = req.user;

        const doctor = await Doctor.findById(doctorId).select("name type price hospital").exec();
        if (!doctor) {
            return res.status(404).json({ message: "Dokter tidak ditemukan" });
        }

        const schedule = await Schedule.findById(scheduleId).select("date").exec();
        if (!schedule) {
            return res.status(404).json({ message: "Jadwal tidak ditemukan" });
        }

        const workHour = await WorkHour.findById(workHourId).select("availSlot isAvail").exec();
        if (!workHour) {
            return res.status(404).json({ message: "Jam kerja tidak ditemukan" });
        }

        const response = {
            user: { email, username },
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                type: doctor.type,
                price: doctor.price,
                hospital: doctor.hospital
            },
            date: schedule.date,
            time: {
                availSlot: workHour.availSlot,
                isAvail: workHour.isAvail
            }
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("Error during fetching appointment details", error);
        res.status(500).json({ message: error.message });
    }
};