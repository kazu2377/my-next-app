'use server';

import { revalidatePath } from 'next/cache';
import { ReservationType, supabase } from './supabase';

// 全予約データを取得
export async function getAllReservations() {
  
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('date', { ascending: true });
  
  if (error) {
    console.error('予約データの取得エラー:', error);
    return { success: false, error: '予約データの取得に失敗しました' };
  }
  
  return { success: true, data: data as ReservationType[] };
}

// 特定の予約を取得
export async function getReservationById(id: string) {
  
  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('予約データの取得エラー:', error);
    return { success: false, error: '予約データの取得に失敗しました' };
  }
  
  return { success: true, data: data as ReservationType };
}

// 予約を削除するサーバーアクション
export async function deleteReservation(id: string) {
  
  if (!id) {
    return { success: false, error: '予約IDが指定されていません' };
  }
  
  const { error } = await supabase
    .from('reservations')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('予約削除エラー:', error);
    return { success: false, error: '予約の削除中にエラーが発生しました' };
  }
  
  // 管理画面を再検証
  revalidatePath('/administrators');
  
  return { success: true };
}

// 予約を編集するサーバーアクション
export async function updateReservation(formData: FormData) {
  
  const id = formData.get('id') as string;
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const notes = formData.get('notes') as string;
  
  if (!id || !name || !phone || !email || !date || !time) {
    return { success: false, error: '必須項目をすべて入力してください' };
  }
  
  // 予約時間の重複チェック
  const { data: existingReservations } = await supabase
    .from('reservations')
    .select('id')
    .eq('date', date)
    .eq('time', time)
    .neq('id', id); // 自分自身は除外
  
  if (existingReservations && existingReservations.length > 0) {
    return { success: false, error: 'この日時はすでに予約されています' };
  }
  
  const { error } = await supabase
    .from('reservations')
    .update({
      name,
      phone,
      email,
      date,
      time,
      notes: notes || null
    })
    .eq('id', id);
  
  if (error) {
    console.error('予約更新エラー:', error);
    return { success: false, error: '予約の更新中にエラーが発生しました' };
  }
  
  // 管理画面を再検証
  revalidatePath('/administrators');
  
  return { success: true };
}

// 管理者による予約追加のサーバーアクション
export async function addReservation(formData: FormData) {
  
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const notes = formData.get('notes') as string;
  
  if (!name || !phone || !email || !date || !time) {
    return { success: false, error: '必須項目をすべて入力してください' };
  }
  
  // 予約時間の重複チェック
  const { data: existingReservations } = await supabase
    .from('reservations')
    .select('id')
    .eq('date', date)
    .eq('time', time);
  
  if (existingReservations && existingReservations.length > 0) {
    return { success: false, error: 'この日時はすでに予約されています' };
  }
  
  const newReservation = {
    name,
    phone,
    email,
    date,
    time,
    notes: notes || null
  };
  
  const { error } = await supabase
    .from('reservations')
    .insert([newReservation]);
  
  if (error) {
    console.error('予約追加エラー:', error);
    return { success: false, error: '予約の追加中にエラーが発生しました' };
  }
  
  // 管理画面を再検証
  revalidatePath('/administrators');
  
  return { success: true };
} 