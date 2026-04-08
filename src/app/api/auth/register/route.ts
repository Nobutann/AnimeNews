import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
        return NextResponse.json({ error: 'Preencha todos os campos' }, { status: 400});
    }

    if (password.length < 8) {
        return NextResponse.json({ error: 'Senha deve ter no mínimo 8 caracteres' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email }});

    if (existing) {
        return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.create({
        data: { name, email, password: hashed },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
}