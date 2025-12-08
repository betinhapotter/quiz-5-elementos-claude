import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Element, ElementScores, Answer } from '@/types/quiz';

interface SaveResultBody {
  scores: ElementScores;
  lowestElement: Element;
  lowestScore: number;
  secondLowestElement?: Element;
  pattern?: string;
  answers: Answer[];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    
    // Verifica se usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const body: SaveResultBody = await request.json();
    const { scores, lowestElement, lowestScore, secondLowestElement, pattern, answers } = body;

    // Validação
    if (!scores || !lowestElement) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      );
    }

    // Salva o resultado no banco
    const { data: quizResult, error: insertError } = await supabase
      .from('quiz_results')
      .insert({
        user_id: user.id,
        terra_score: scores.terra,
        agua_score: scores.agua,
        ar_score: scores.ar,
        fogo_score: scores.fogo,
        eter_score: scores.eter,
        lowest_element: lowestElement,
        lowest_score: lowestScore,
        second_lowest_element: secondLowestElement || null,
        pattern: pattern || null,
        raw_answers: answers,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erro ao salvar resultado:', insertError);
      return NextResponse.json(
        { error: 'Erro ao salvar resultado' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      resultId: quizResult.id,
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// GET - Buscar histórico de resultados do usuário
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    const { data: results, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar resultados:', error);
      return NextResponse.json(
        { error: 'Erro ao buscar resultados' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      results,
    });

  } catch (error) {
    console.error('Erro inesperado:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
