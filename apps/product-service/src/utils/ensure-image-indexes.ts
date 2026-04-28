import { prisma } from "../../../../packages/libs/prisma";

const IMAGE_COLLECTION = "images";

const ensurePartialUniqueIndex = async (
  indexName: string,
  key: "userId" | "shopId",
) => {
  try {
    await prisma.$runCommandRaw({
      dropIndexes: IMAGE_COLLECTION,
      index: indexName,
    });
  } catch (error: any) {
    const codeName = error?.codeName;
    const message = error?.message || "";

    if (codeName !== "IndexNotFound" && !message.includes("index not found")) {
      throw error;
    }
  }

  await prisma.$runCommandRaw({
    createIndexes: IMAGE_COLLECTION,
    indexes: [
      {
        key: { [key]: 1 },
        name: indexName,
        unique: true,
        partialFilterExpression: {
          [key]: { $type: "objectId" },
        },
      },
    ],
  });
};

export const ensureImageIndexes = async () => {
  await ensurePartialUniqueIndex("images_userId_key", "userId");
  await ensurePartialUniqueIndex("images_shopId_key", "shopId");
};
