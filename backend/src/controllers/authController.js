const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const userExists = await prisma.user.findUnique({
      where: { email },
    })

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })

    res.status(201).json({
      ...user,
      token,
    })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    })

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    })
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' })
  }
}
