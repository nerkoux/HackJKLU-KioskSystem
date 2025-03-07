"use client";

import { useEffect, useState } from 'react';

export default function FormattedDate({ date }: { date: Date | string }) {
  const [formattedDate, setFormattedDate] = useState('');
  
  useEffect(() => {
    // Format the date on the client side only
    const dateObj = date instanceof Date ? date : new Date(date);
    setFormattedDate(dateObj.toLocaleDateString());
  }, [date]);
  
  return <>{formattedDate}</>;
}