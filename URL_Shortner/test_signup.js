
async function testSignup() {
  const email = `test${Date.now()}@example.com`;
  const response = await fetch('http://localhost:8000/user/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      firstname: 'Test',
      lastname: 'User',
      email: email,
      password: 'password123',
    }),
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Body:', JSON.stringify(data, null, 2));

  if (response.status === 201 && data.data && data.data.userId) {
    console.log('SUCCESS: User created successfully');
  } else {
    console.log('FAILURE: User creation failed');
    process.exit(1);
  }
}

testSignup().catch(console.error);
