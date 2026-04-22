import cron from "node-cron";
import { prisma } from "../../../../packages/libs/prisma";

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();

    // Delete products that have been in the deleted state for more than 24 hours
    const deletedProducts = await prisma.products.deleteMany({
      where: {
        isDeleted: true,
        deletedAt: { lte: now },
      },
    });

    console.log(
      `${deletedProducts.count} expired products permanently deleted!`,
    );
  } catch (error) {
    console.log(error);
  }
});
