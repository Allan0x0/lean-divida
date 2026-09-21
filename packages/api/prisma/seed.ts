import bcrypt from "bcryptjs";
import { prisma } from "../src/db";

const PASSWORD = "default@6781";

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      userType: "ADMIN",
      passwordHash,
    },
  });

  const officerDetails = [
    { email: "officer1@example.com", name: "Officer One" },
    { email: "officer2@example.com", name: "Officer Two" },
  ];
  const officers = await Promise.all(
    officerDetails.map((o) => {
      return prisma.user.upsert({
        where: { email: o.email },
        update: {},
        create: { ...o, userType: "OFFICER", passwordHash },
      });
    }),
  );

  const [o1, o2] = officers;
  const leads = [
    { borrowerName: "Alice Banda", borrowerPhone: "+263771000001", amount: 50000, status: "PENDING", officerId: o1.id },
    { borrowerName: "Brian Chuma", borrowerPhone: "+263771000002", amount: 120000, status: "APPROVED", officerId: o1.id },
    { borrowerName: "Chipo Dube", borrowerPhone: "+263771000003", amount: 75000, status: "REJECTED", officerId: o2.id },
    { borrowerName: "Dan Ede", borrowerPhone: "+263771000004", amount: 200000, status: "PENDING", officerId: o2.id },
  ] as const;

  const count = await prisma.lead.count();
  if (!count) {
    await prisma.lead.createMany({
      data: leads.map((l) => ({ ...l }))
    });
  }

  console.log(`Seeded: admin ${admin.email}, ${officers.length} officers, leads ready. Password for all: ${PASSWORD}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
