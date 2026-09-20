export const MOCK_SUBJECTS = [
  {
    subjectId: 1,
    subjectName: 'Database Management Systems',
    description: 'Relational models, SQL query optimization, transaction management, ACID properties, and database indexing techniques.',
    icon: 'database',
    topicsCount: 4,
    questionsCount: 15
  },
  {
    subjectId: 2,
    subjectName: 'Java Programming',
    description: 'Object-oriented programming, modern Java language features, Collections framework, streams, and concurrency.',
    icon: 'code',
    topicsCount: 4,
    questionsCount: 15
  },
  {
    subjectId: 3,
    subjectName: 'Data Structures',
    description: 'Foundational data structures, arrays, linked lists, binary search trees, heaps, graphs, and algorithmic complexity.',
    icon: 'layers',
    topicsCount: 4,
    questionsCount: 15
  },
  {
    subjectId: 4,
    subjectName: 'Operating Systems',
    description: 'Process synchronization, CPU scheduling algorithms, virtual memory paging, deadlocks, and storage management.',
    icon: 'cpu',
    topicsCount: 3,
    questionsCount: 12
  },
  {
    subjectId: 5,
    subjectName: 'Computer Networks',
    description: 'OSI reference model, TCP/IP stack, IP routing protocols, transport layer flow control, and DNS/HTTP architectures.',
    icon: 'globe',
    topicsCount: 3,
    questionsCount: 12
  },
  {
    subjectId: 6,
    subjectName: 'Software Engineering',
    description: 'Software development lifecycle, Agile methodologies, software architecture patterns, CI/CD, and quality testing.',
    icon: 'check-circle',
    topicsCount: 2,
    questionsCount: 10
  }
];

export const MOCK_TOPICS = [
  // DBMS
  { topicId: 1, subjectId: 1, topicName: 'SQL & Relational Queries', description: 'Structured Query Language, JOIN operations, aggregations, subqueries, and views.', questionsCount: 5 },
  { topicId: 2, subjectId: 1, topicName: 'Normalization & Schema Design', description: '1NF, 2NF, 3NF, BCNF, functional dependencies, and lossless decompositions.', questionsCount: 4 },
  { topicId: 3, subjectId: 1, topicName: 'Transactions & Concurrency Control', description: 'ACID properties, serializability, two-phase locking (2PL), and isolation levels.', questionsCount: 3 },
  { topicId: 4, subjectId: 1, topicName: 'Indexing & Query Optimization', description: 'B+ trees, hash indexes, query execution plans, and cost-based optimization.', questionsCount: 3 },

  // Java
  { topicId: 5, subjectId: 2, topicName: 'OOP Concepts & Principles', description: 'Encapsulation, inheritance, polymorphism, abstraction, and SOLID design principles in Java.', questionsCount: 4 },
  { topicId: 6, subjectId: 2, topicName: 'Collections Framework', description: 'Lists, Sets, Maps, Queues, Iterators, and the internal mechanics of HashMap and ConcurrentHashMap.', questionsCount: 3 },
  { topicId: 7, subjectId: 2, topicName: 'Exception Handling', description: 'Checked vs unchecked exceptions, try-catch-finally, try-with-resources, and custom exceptions.', questionsCount: 3 },
  { topicId: 8, subjectId: 2, topicName: 'Multithreading & Concurrency', description: 'Thread lifecycles, synchronization, volatile keyword, locks, and the Executor framework.', questionsCount: 3 },

  // Data Structures
  { topicId: 9, subjectId: 3, topicName: 'Arrays & Dynamic Arrays', description: 'Contiguous memory allocation, time complexity, two-pointer techniques, and sliding window.', questionsCount: 3 },
  { topicId: 10, subjectId: 3, topicName: 'Linked Lists', description: 'Singly, doubly, and circular linked lists, fast and slow pointers, and cycle detection.', questionsCount: 3 },
  { topicId: 11, subjectId: 3, topicName: 'Stacks & Queues', description: 'LIFO and FIFO data structures, monotonic stacks, priority queues, and deque applications.', questionsCount: 3 },
  { topicId: 12, subjectId: 3, topicName: 'Trees & Binary Search Trees', description: 'Tree traversals, BST operations, AVL balance, and hierarchical complexity.', questionsCount: 4 },

  // Operating Systems
  { topicId: 13, subjectId: 4, topicName: 'Process Management & Threads', description: 'PCB structure, context switching, fork(), process states, and kernel vs user threads.', questionsCount: 3 },
  { topicId: 14, subjectId: 4, topicName: 'CPU Scheduling Algorithms', description: 'FCFS, SJF, Round Robin, Priority scheduling, and preemptive vs non-preemptive logic.', questionsCount: 3 },
  { topicId: 15, subjectId: 4, topicName: 'Memory Management & Paging', description: 'Virtual memory, page tables, TLB, page fault handling, and page replacement policies.', questionsCount: 3 },

  // Computer Networks
  { topicId: 16, subjectId: 5, topicName: 'OSI & TCP/IP Models', description: 'Layered architecture, responsibilities of each layer, encapsulation, and packet headers.', questionsCount: 3 },
  { topicId: 17, subjectId: 5, topicName: 'IP Addressing & Subnetting', description: 'IPv4, IPv6, CIDR notation, subnet masks, ARP protocol, and NAT translation.', questionsCount: 3 },
  { topicId: 18, subjectId: 5, topicName: 'Transport Layer (TCP & UDP)', description: 'Three-way handshake, connection termination, congestion control, and windowing.', questionsCount: 3 },

  // Software Engineering
  { topicId: 19, subjectId: 6, topicName: 'SDLC & Agile Methodologies', description: 'Waterfall, Spiral, Agile Scrum, sprint cycles, user stories, and Kanban workflows.', questionsCount: 3 },
  { topicId: 20, subjectId: 6, topicName: 'Design Patterns', description: 'Creational, Structural, and Behavioral design patterns in production software.', questionsCount: 3 }
];

export const MOCK_QUESTIONS = [
  // Topic 1: SQL
  {
    questionId: 101,
    topicId: 1,
    questionText: 'Which SQL clause is used to filter records that result from a GROUP BY aggregation?',
    optionA: 'WHERE',
    optionB: 'HAVING',
    optionC: 'ORDER BY',
    optionD: 'LIMIT',
    correctAnswer: 'B',
    difficulty: 'EASY',
    marks: 1,
    explanation: 'HAVING is applied after grouping to filter aggregated result sets, whereas WHERE filters individual rows before grouping.'
  },
  {
    questionId: 102,
    topicId: 1,
    questionText: 'Which type of JOIN returns only the rows that have matching values in both tables?',
    optionA: 'LEFT JOIN',
    optionB: 'RIGHT JOIN',
    optionC: 'INNER JOIN',
    optionD: 'FULL OUTER JOIN',
    correctAnswer: 'C',
    difficulty: 'EASY',
    marks: 1,
    explanation: 'INNER JOIN selects records that have matching values in both tables.'
  },
  {
    questionId: 103,
    topicId: 1,
    questionText: 'What is the outcome of using UNION instead of UNION ALL in SQL?',
    optionA: 'UNION preserves duplicate records while UNION ALL removes them',
    optionB: 'UNION removes duplicate rows from the final result set whereas UNION ALL retains them',
    optionC: 'UNION performs an inner join while UNION ALL performs an outer join',
    optionD: 'UNION only works on indexed columns',
    correctAnswer: 'B',
    difficulty: 'MEDIUM',
    marks: 1,
    explanation: 'UNION performs a distinct sort operation to eliminate duplicate tuples, whereas UNION ALL simply concatenates result sets.'
  },
  {
    questionId: 104,
    topicId: 1,
    questionText: 'What will happen when you execute: SELECT COUNT(*), COUNT(col) FROM tbl; where col contains some NULL values?',
    optionA: 'Both counts will be equal to the total row count',
    optionB: 'COUNT(*) counts all rows including NULLs, while COUNT(col) counts only rows where col IS NOT NULL',
    optionC: 'COUNT(*) throws an exception if NULL values exist',
    optionD: 'COUNT(col) counts only NULL values',
    correctAnswer: 'B',
    difficulty: 'MEDIUM',
    marks: 1,
    explanation: 'COUNT(*) returns the count of all rows in the relation, while COUNT(column_name) ignores NULL entries.'
  },
  {
    questionId: 105,
    topicId: 1,
    questionText: 'In SQL, what is the effect of using the DENSE_RANK() window function compared to RANK() when two rows have identical values?',
    optionA: 'DENSE_RANK() leaves gaps in ranking numbers after ties, while RANK() does not',
    optionB: 'RANK() leaves gaps in sequence numbers after ties, whereas DENSE_RANK() assigns consecutive integers without gaps',
    optionC: 'DENSE_RANK() cannot be used with an OVER clause',
    optionD: 'Both functions always output identical sequence numbers regardless of ties',
    correctAnswer: 'B',
    difficulty: 'HARD',
    marks: 1,
    explanation: 'RANK() produces gaps in the ranking sequence when ties occur (e.g., 1, 2, 2, 4), whereas DENSE_RANK() produces continuous ranks (1, 2, 2, 3).'
  },

  // Topic 2: Normalization
  {
    questionId: 201,
    topicId: 2,
    questionText: 'A database relation is said to be in First Normal Form (1NF) if and only if:',
    optionA: 'Every determinant is a candidate key',
    optionB: 'All column values are atomic and there are no repeating groups',
    optionC: 'All transitive dependencies are eliminated',
    optionD: 'All partial key dependencies are removed',
    correctAnswer: 'B',
    difficulty: 'EASY',
    marks: 1,
    explanation: '1NF mandates that table attributes contain atomic values and no repeating groups.'
  },
  {
    questionId: 202,
    topicId: 2,
    questionText: 'Second Normal Form (2NF) directly eliminates which type of dependency?',
    optionA: 'Transitive dependency',
    optionB: 'Partial functional dependency on a composite primary key',
    optionC: 'Multivalued dependency',
    optionD: 'Join dependency',
    correctAnswer: 'B',
    difficulty: 'MEDIUM',
    marks: 1,
    explanation: '2NF requires 1NF and additionally ensures that no non-prime attribute is partially dependent on any candidate key.'
  },
  {
    questionId: 203,
    topicId: 2,
    questionText: 'Third Normal Form (3NF) requires that a relation is in 2NF and has no:',
    optionA: 'Composite keys',
    optionB: 'Transitive functional dependencies on any candidate key',
    optionC: 'Foreign keys',
    optionD: 'Primary key constraints',
    correctAnswer: 'B',
    difficulty: 'MEDIUM',
    marks: 1,
    explanation: '3NF eliminates transitive dependencies: non-key attributes must rely directly on candidate keys.'
  },
  {
    questionId: 204,
    topicId: 2,
    questionText: 'Under Boyce-Codd Normal Form (BCNF), for every non-trivial functional dependency X -> Y, what condition must hold?',
    optionA: 'Y must be a prime attribute',
    optionB: 'X must be a superkey of the relation',
    optionC: 'X must be a foreign key in another table',
    optionD: 'The relation must not contain composite attributes',
    correctAnswer: 'B',
    difficulty: 'HARD',
    marks: 1,
    explanation: 'BCNF requires that for every functional dependency X -> Y, determinant X must strictly be a superkey.'
  },

  // Topic 5: Java OOP
  {
    questionId: 501,
    topicId: 5,
    questionText: 'Which OOP principle is implemented in Java by making class fields private and providing public getter/setter methods?',
    optionA: 'Polymorphism',
    optionB: 'Encapsulation',
    optionC: 'Inheritance',
    optionD: 'Abstraction',
    correctAnswer: 'B',
    difficulty: 'EASY',
    marks: 1,
    explanation: 'Encapsulation bundles data and methods operating on that data, restricting direct access.'
  },
  {
    questionId: 502,
    topicId: 5,
    questionText: 'Can an abstract class in Java declare constructors?',
    optionA: 'No, abstract classes cannot have constructors because they cannot be instantiated directly',
    optionB: 'Yes, abstract classes can declare constructors to initialize fields when a subclass instance is instantiated via super()',
    optionC: 'Only if the constructor is private',
    optionD: 'Only if the constructor is static',
    correctAnswer: 'B',
    difficulty: 'MEDIUM',
    marks: 1,
    explanation: 'Abstract classes have constructors invoked by subclasses via super() to initialize base class state.'
  },
  {
    questionId: 503,
    topicId: 5,
    questionText: 'According to the Liskov Substitution Principle (LSP) in SOLID design, what must be true?',
    optionA: 'Subclasses must provide completely different public APIs',
    optionB: 'Objects of a superclass should be replaceable with objects of its subclasses without breaking program correctness',
    optionC: 'Interfaces should contain as many default methods as possible',
    optionD: 'A class should only have one reason to change',
    correctAnswer: 'B',
    difficulty: 'HARD',
    marks: 1,
    explanation: 'LSP states that derived types must be completely substitutable for their base types without altering correctness.'
  },

  // Generic fallbacks for other topics
  {
    questionId: 901,
    topicId: 9,
    questionText: 'What is the average time complexity of accessing an element in an array by its index?',
    optionA: 'O(n)',
    optionB: 'O(1)',
    optionC: 'O(log n)',
    optionD: 'O(n log n)',
    correctAnswer: 'B',
    difficulty: 'EASY',
    marks: 1,
    explanation: 'Array elements are stored in contiguous memory addresses, allowing direct pointer arithmetic in O(1) time.'
  },
  {
    questionId: 902,
    topicId: 9,
    questionText: 'Which algorithmic pattern is optimal for finding a contiguous subarray with maximum sum in an array?',
    optionA: 'Two-pointer on sorted array',
    optionB: 'Kadane\'s Algorithm (Dynamic Programming)',
    optionC: 'Binary Search',
    optionD: 'Breadth-First Search',
    correctAnswer: 'B',
    difficulty: 'MEDIUM',
    marks: 1,
    explanation: 'Kadane\'s algorithm finds the maximum subarray sum in O(n) time and O(1) space.'
  },
  {
    questionId: 903,
    topicId: 9,
    questionText: 'In a dynamic array with geometric resizing (factor 2), what is the amortized cost per append operation?',
    optionA: 'O(n)',
    optionB: 'O(1)',
    optionC: 'O(log n)',
    optionD: 'O(n^2)',
    correctAnswer: 'B',
    difficulty: 'HARD',
    marks: 1,
    explanation: 'Doubling capacity upon reaching limit yields an amortized constant O(1) time per insertion over n operations.'
  }
];

export const MOCK_USER = {
  userId: 1,
  name: 'Ram Ratan',
  email: 'student@college.edu',
  role: 'STUDENT',
  createdAt: '2026-09-20T10:00:00Z'
};

export const MOCK_PERFORMANCE_SUMMARY = {
  totalAttempts: 5,
  completedQuizzes: 4,
  totalQuestionsAnswered: 24,
  totalCorrectAnswers: 19,
  overallAccuracy: 79.2,
  averageScore: 78.5,
  currentStreak: 3,
  recommendedFocus: 'Indexing & Query Optimization'
};

export const MOCK_TOPIC_PERFORMANCES = [
  { topicId: 1, topicName: 'SQL & Relational Queries', subjectName: 'DBMS', attemptsCount: 3, accuracy: 85.0, masteryLevel: 'MASTERED' },
  { topicId: 2, topicName: 'Normalization & Schema Design', subjectName: 'DBMS', attemptsCount: 2, accuracy: 75.0, masteryLevel: 'INTERMEDIATE' },
  { topicId: 5, topicName: 'OOP Concepts & Principles', subjectName: 'Java Programming', attemptsCount: 2, accuracy: 80.0, masteryLevel: 'MASTERED' },
  { topicId: 9, topicName: 'Arrays & Dynamic Arrays', subjectName: 'Data Structures', attemptsCount: 1, accuracy: 66.7, masteryLevel: 'NEEDS_PRACTICE' }
];
