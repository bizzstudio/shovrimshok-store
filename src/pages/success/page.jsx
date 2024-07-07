import React from 'react'
import cartImg from 'public/cart success.svg'
import Link from 'next/link'

export default function Success() {
  return (
    <div className='flex flex-col gap-5'>
        <img src={cartImg.src} alt="הרכישה הושלמה בהצלחה" />
        <h2>Thank you for your purchase</h2>
        <p>we will contact you soon</p>
        <Link href="/">Back to home</Link>
    </div>
  )
}
