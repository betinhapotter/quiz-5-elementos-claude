import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email, name, userId, lowestElement, lowestScore, pattern } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Insere o lead na tabela
    const { data, error } = await supabase
      .from('leads')
      .insert({
        email: email.toLowerCase().trim(),
        name: name || null,
        user_id: userId || null,
        lowest_element: lowestElement || null,
        lowest_score: lowestScore || null,
        pattern: pattern || null,
      })
      .select()
      .single();

    if (error) {
      // Se o erro for de duplicata (email já existe), ainda retorna sucesso
      // mas loga o erro para monitoramento
      if (error.code === '23505') {
        console.log('Email já cadastrado:', email);
        return NextResponse.json({
          success: true,
          message: 'Email já cadastrado',
          data: null,
        });
      }
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    });

  } catch (error: any) {
    console.error('Erro ao salvar lead:', error);
    return NextResponse.json(
      {
        error: 'Erro ao salvar lead',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

