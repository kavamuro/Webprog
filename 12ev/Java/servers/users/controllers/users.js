let users = [
  { id: 1, name: "Alan" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Cloe" },
];

export const getAllUsers = (req, res) => {
  res.json(users);
};

export const getUserById = (req, res) => {
  const id = +req.params.id;
  const user = users.find((x) => x.id == id);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }
  res.status(200).json(user);
};

export const saveUser = (req, res) => {
  // const name = req.body.name
  const { name, age } = req.body;
  const nextId = users[users.length - 1]?.id + 1 || 0 + 1;
  const user = { id: nextId, name };
  users.push(user);
  res.status(200).json(user);
};

export const updateUser = (req, res) => {
  const id = +req.params.id;
  const user = users.find((x) => x.id === id);
  if (!user) {
    return res.status(404).json({ message: "User not found!" });
  }
  const name = req.body;
  user.name = name;
  res.status(200).json(user);
};

export const deleteUser = (req, res) => {
  const id = +req.params.id;
  users = users.filter((x) => x.id !== id);
  res.status(200).json({ message: "Delete success" });
};
