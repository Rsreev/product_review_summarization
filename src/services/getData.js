export async function getAllUsers(data) {
    const response = await fetch(`http://localhost:8001/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      })


    
    return await response.json();
    
}

export async function summarizeReviews(data) {
  const response = await fetch(`http://localhost:8001/summarize`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    })


  
  return await response.json();
  
}
