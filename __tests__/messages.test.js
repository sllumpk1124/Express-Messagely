const db = require("../db");
const User = require("../models/user");
const Message = require("../models/message");

describe("Test Message class", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");
    await db.query("ALTER SEQUENCE messages_id_seq RESTART WITH 1");
  
    await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155550000",
    });
  
    await User.register({
      username: "test2",
      password: "password",
      first_name: "Test2",
      last_name: "Testy2",
      phone: "+14155552222",
    });
  
    await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "u1-to-u2",
    });
  
    await Message.create({
      from_username: "test2",
      to_username: "test1",
      body: "u2-to-u1",
    });
  });

  test("can create", async function () {
    const m = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "new",
    });

    expect(m).toEqual({
      id: expect.any(Number),
      from_username: "test1",
      to_username: "test2",
      body: "new",
      sent_at: expect.any(Date),
    });
  });

  test("can mark read", async function () {
    const m = await Message.create({
      from_username: "test1",
      to_username: "test2",
      body: "new",
    });
    expect(m.read_at).toBe(undefined);

    await Message.markRead(m.id); // Add `await` here
    const result = await db.query("SELECT read_at FROM messages WHERE id=$1", [m.id]);
    expect(result.rows[0].read_at).toEqual(expect.any(Date));
  });

  test("can get", async function () {
    const u = await Message.get(1);
    expect(u).toEqual({
      id: expect.any(Number),
      body: "u1-to-u2",
      sent_at: expect.any(Date),
      read_at: null,
      from_user: {
        username: "test1",
        first_name: "Test1",
        last_name: "Testy1",
        phone: "+14155550000",
      },
      to_user: {
        username: "test2",
        first_name: "Test2",
        last_name: "Testy2",
        phone: "+14155552222",
      },
    });
  });

  afterAll(async function () {
    await db.end();
  });
});