import React from 'react';
import styles from '../YelpsReviews.css';
import Icon from './icons/wrapper.jsx'

function HoverLinks(props) {
  return (
    <ul className={styles.hoverlinks}>
      <li className={styles.shareLink}>Share Review</li>
      <li>Embed Review</li>
      <li>Compliment</li>
      <li>Send message</li>
      <li>Follow </li>
      <Icon className='friends' icon='friends' />
      <Icon icon='message'/>
    </ul>
  )
}

export default HoverLinks;