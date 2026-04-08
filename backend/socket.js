
import User from "./models/user.model.js";

export const socketHandler = (io) => {

  io.on("connection", (socket) => {

    // console.log("Socket connected:", socket.id);

    /* Identify user */

    socket.on("identity", async ({ userId, role }) => {

      try {

        await User.findByIdAndUpdate(userId, {
          socketId: socket.id,
          isOnline: true
        });

        /* join rooms */

        if (role) {
          socket.join(role);
        }

        socket.join(userId);

        // console.log(`${role} connected`);

      } catch (error) {
        console.log(error);
      }

    });


    /* Delivery location update */

    socket.on("updateLocation", async ({ latitude, longitude, userId }) => {

      try {

        const user = await User.findByIdAndUpdate(userId, {
          location: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          socketId: socket.id,
          isOnline: true
        });

        if (user) {

          io.to("admin").emit("updateDeliveryLocation", {
            deliveryBoyId: userId,
            latitude,
            longitude
          });

        }

      } catch (error) {
        console.log("location update error");
      }

    });


    socket.on("disconnect", async () => {

      try {

        await User.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null, isOnline: false }
        );

        // console.log("Socket disconnected");

      } catch (error) {
        console.log(error);
      }

    });

  });

};
