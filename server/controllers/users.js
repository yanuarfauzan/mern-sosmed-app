import User from "../models/User.js";

// READ
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        // mengambil informasi teman dari collection user
        // pada setiap iterasi, ID temen disimpan di variabel id
        // jadi data user/teman(yang lagi dikunjungi) berdasarkan dari id teman pada collection user yang lagi login akan di ambil dan ditampilkan
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        // mengambil data teman satu row sesuai id berdasarkan urutan data nya
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

// UPDATE

export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;

        // mengambil data berdasarkan id dari collection user
        const user = await User.findById(id);
        // mengambil data berdasarkan freindId di collection user
        // menghasilkan data user lain yaitu teman
        const friend = await User.findById(friendId);


        // fitur tambah atau hapus teman
        // jika di collection user.friends ada friendId artinya sudah berteman jadi fungsi yang dijalankan menghapus teman
        if (user.friends.includes(friendId)) {
            // menghapus friendId dari collection user
            user.friends = friend.friends.filter((id) => id !== friendId);
            // menghapus friendId dari collection friend
            friend.friends = friend.friends.filter((id) => id !== id);
            // jika di collection user.friends tidak ada friendId artinya tidak berteman jadi fungsi yang dijalankan menambahkan teman
        } else {
            // menambahkan friendId ke collection user
            user.friends.push(friendId);
            // menambahkan friendId ke collection friend
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();


        // mengambil informasi teman dari collection user
        // pada setiap iterasi, ID temen disimpan di variabel id
        // jadi data user/teman(yang lagi dikunjungi) berdasarkan dari id teman pada collection user yang lagi login akan di ambil dan ditampilkan
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}