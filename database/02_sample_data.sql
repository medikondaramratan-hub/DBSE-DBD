-- ============================================================
-- EXAM PREPARATION APP WITH ADAPTIVE QUIZZES
-- Sample Seed Dataset (PostgreSQL 18)
-- Review-3 Artifact
-- ============================================================

-- ------------------------------------------------------------
-- ------------------------------------------------------------
-- SEED SUBJECTS (6 Core Academic Subjects)
-- ------------------------------------------------------------
INSERT INTO subjects (subject_id, subject_name, description, icon) VALUES
(1, 'Database Management Systems', 'Relational models, SQL query optimization, transaction management, ACID properties, and database indexing techniques.', 'database'),
(2, 'Java Programming', 'Object-oriented programming, modern Java language features, Collections framework, streams, and concurrency.', 'code'),
(3, 'Data Structures', 'Foundational data structures, arrays, linked lists, binary search trees, heaps, graphs, and algorithmic complexity.', 'layers'),
(4, 'Operating Systems', 'Process synchronization, CPU scheduling algorithms, virtual memory paging, deadlocks, and storage management.', 'cpu'),
(5, 'Computer Networks', 'OSI reference model, TCP/IP stack, IP routing protocols, transport layer flow control, and DNS/HTTP architectures.', 'globe'),
(6, 'Software Engineering', 'Software development lifecycle, Agile methodologies, software architecture patterns, CI/CD, and quality testing.', 'check-circle')
ON CONFLICT (subject_name) DO NOTHING;

-- ------------------------------------------------------------
-- SEED TOPICS (20 Topics across 6 Subjects)
-- ------------------------------------------------------------
-- Subject 1: DBMS
INSERT INTO topics (topic_id, subject_id, topic_name, description) VALUES
(1, 1, 'SQL & Relational Queries', 'Structured Query Language, JOIN operations, aggregations, subqueries, and views.'),
(2, 1, 'Normalization & Schema Design', '1NF, 2NF, 3NF, BCNF, functional dependencies, and lossless decompositions.'),
(3, 1, 'Transactions & Concurrency Control', 'ACID properties, serializability, two-phase locking (2PL), and isolation levels.'),
(4, 1, 'Indexing & Query Optimization', 'B+ trees, hash indexes, query execution plans, and cost-based optimization.');

-- Subject 2: Java Programming
INSERT INTO topics (topic_id, subject_id, topic_name, description) VALUES
(5, 2, 'OOP Concepts & Principles', 'Encapsulation, inheritance, polymorphism, abstraction, and SOLID design principles in Java.'),
(6, 2, 'Collections Framework', 'Lists, Sets, Maps, Queues, Iterators, and the internal mechanics of HashMap and ConcurrentHashMap.'),
(7, 2, 'Exception Handling', 'Checked vs unchecked exceptions, try-catch-finally, try-with-resources, and custom exceptions.'),
(8, 2, 'Multithreading & Concurrency', 'Thread lifecycles, synchronization, volatile keyword, locks, and the Executor framework.');

-- Subject 3: Data Structures
INSERT INTO topics (topic_id, subject_id, topic_name, description) VALUES
(9, 3, 'Arrays & Dynamic Arrays', 'Contiguous memory allocation, time complexity, two-pointer techniques, and sliding window.'),
(10, 3, 'Linked Lists', 'Singly, doubly, and circular linked lists, fast and slow pointers, and cycle detection.'),
(11, 3, 'Stacks & Queues', 'LIFO and FIFO data structures, monotonic stacks, priority queues, and deque applications.'),
(12, 3, 'Trees & Binary Search Trees', 'Tree traversals (inorder, preorder, postorder, level-order), BST operations, and AVL balance.');

-- Subject 4: Operating Systems
INSERT INTO topics (topic_id, subject_id, topic_name, description) VALUES
(13, 4, 'Process Management & Threads', 'PCB structure, context switching, fork(), process states, and kernel vs user threads.'),
(14, 4, 'CPU Scheduling Algorithms', 'FCFS, SJF, Round Robin, Priority scheduling, and preemptive vs non-preemptive logic.'),
(15, 4, 'Memory Management & Paging', 'Virtual memory, page tables, TLB, page fault handling, and page replacement policies (FIFO, LRU).');

-- Subject 5: Computer Networks
INSERT INTO topics (topic_id, subject_id, topic_name, description) VALUES
(16, 5, 'OSI & TCP/IP Models', 'Layered architecture, responsibilities of each layer, encapsulation, and packet headers.'),
(17, 5, 'IP Addressing & Subnetting', 'IPv4, IPv6, CIDR notation, subnet masks, ARP protocol, and NAT translation.'),
(18, 5, 'Transport Layer (TCP & UDP)', 'Three-way handshake, connection termination, congestion control, windowing, and UDP reliability.');

-- Subject 6: Software Engineering
INSERT INTO topics (topic_id, subject_id, topic_name, description) VALUES
(19, 6, 'SDLC & Agile Methodologies', 'Waterfall, Spiral, Agile Scrum, sprint cycles, user stories, and Kanban workflows.'),
(20, 6, 'Design Patterns', 'Creational (Singleton, Factory), Structural (Adapter, Decorator), and Behavioral (Observer, Strategy).');

-- ------------------------------------------------------------
-- SEED QUESTIONS (60+ Academic Questions across EASY, MEDIUM, HARD)
-- ------------------------------------------------------------

-- TOPIC 1: SQL & Relational Queries
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(1, 'Which SQL clause is used to filter records that result from a GROUP BY aggregation?', 'WHERE', 'HAVING', 'ORDER BY', 'LIMIT', 'B', 'EASY', 1, 'HAVING is applied after grouping to filter aggregated result sets, whereas WHERE filters individual rows before grouping.'),
(1, 'Which type of JOIN returns only the rows that have matching values in both tables?', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN', 'C', 'EASY', 1, 'INNER JOIN selects records that have matching values in both tables.'),
(1, 'What is the outcome of using UNION instead of UNION ALL in SQL?', 'UNION preserves duplicate records while UNION ALL removes them', 'UNION removes duplicate rows from the final result set whereas UNION ALL retains them', 'UNION performs an inner join while UNION ALL performs an outer join', 'UNION only works on indexed columns', 'B', 'MEDIUM', 1, 'UNION performs a distinct sort operation to eliminate duplicate tuples, whereas UNION ALL simply concatenates result sets.'),
(1, 'What will happen when you execute: SELECT COUNT(*), COUNT(col) FROM tbl; where col contains some NULL values?', 'Both counts will be equal to the total row count', 'COUNT(*) counts all rows including NULLs, while COUNT(col) counts only rows where col IS NOT NULL', 'COUNT(*) throws an exception if NULL values exist', 'COUNT(col) counts only NULL values', 'B', 'MEDIUM', 1, 'COUNT(*) returns the count of all rows in the relation, while COUNT(column_name) ignores NULL entries.'),
(1, 'In SQL, what is the effect of using the DENSE_RANK() window function compared to RANK() when two rows have identical values?', 'DENSE_RANK() leaves gaps in ranking numbers after ties, while RANK() does not', 'RANK() leaves gaps in sequence numbers after ties, whereas DENSE_RANK() assigns consecutive integers without gaps', 'DENSE_RANK() cannot be used with an OVER clause', 'Both functions always output identical sequence numbers regardless of ties', 'B', 'HARD', 1, 'RANK() produces gaps in the ranking sequence when ties occur (e.g., 1, 2, 2, 4), whereas DENSE_RANK() produces continuous ranks (1, 2, 2, 3).');

-- TOPIC 2: Normalization & Schema Design
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(2, 'A database relation is said to be in First Normal Form (1NF) if and only if:', 'Every determinant is a candidate key', 'All column values are atomic and there are no repeating groups', 'All transitive dependencies are eliminated', 'All partial key dependencies are removed', 'B', 'EASY', 1, '1NF mandates that table attributes contain atomic (indivisible) values and no repeating groups or multivalued attributes.'),
(2, 'Second Normal Form (2NF) directly eliminates which type of dependency?', 'Transitive dependency', 'Partial functional dependency on a composite primary key', 'Multivalued dependency', 'Join dependency', 'B', 'MEDIUM', 1, '2NF requires 1NF and additionally ensures that no non-prime attribute is partially dependent on any candidate key.'),
(2, 'Third Normal Form (3NF) requires that a relation is in 2NF and has no:', 'Composite keys', 'Transitive functional dependencies on any candidate key', 'Foreign keys', 'Primary key constraints', 'B', 'MEDIUM', 1, '3NF eliminates transitive dependencies: non-key attributes must rely directly on the primary key, nothing else.'),
(2, 'Under Boyce-Codd Normal Form (BCNF), for every non-trivial functional dependency X -> Y, what condition must hold?', 'Y must be a prime attribute', 'X must be a superkey of the relation', 'X must be a foreign key in another table', 'The relation must not contain composite attributes', 'B', 'HARD', 1, 'BCNF is a stricter variant of 3NF requiring that for every functional dependency X -> Y, the determinant X must strictly be a superkey.');

-- TOPIC 3: Transactions & Concurrency Control
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(3, 'What does the ''A'' stand for in the ACID properties of a database transaction?', 'Availability', 'Atomicity', 'Authentication', 'Asynchrony', 'B', 'EASY', 1, 'Atomicity guarantees that all statements within a transaction succeed together or all changes are completely rolled back.'),
(3, 'Which transaction anomaly occurs when a transaction reads data written by another concurrent transaction that has not yet committed?', 'Phantom Read', 'Dirty Read', 'Non-repeatable Read', 'Lost Update', 'B', 'MEDIUM', 1, 'A Dirty Read occurs when Transaction A reads uncommitted modifications made by Transaction B, which might later be rolled back.'),
(3, 'In Two-Phase Locking (2PL), once a transaction releases any lock, it enters which phase?', 'Growing phase where it can acquire new locks', 'Shrinking phase where it cannot acquire any further locks', 'Commit phase where all locks are reacquired', 'Abort phase', 'B', 'HARD', 1, 'In standard 2PL, the shrinking phase begins as soon as the first lock is released; no new locks may be requested during this phase.');

-- TOPIC 4: Indexing & Query Optimization
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(4, 'What is the primary advantage of a B+ Tree index over a standard Hash index in relational databases?', 'Hash index is better for range queries (e.g. BETWEEN, >, <)', 'B+ Tree efficiently supports range queries and sorted scans because leaf nodes are linked in sequential order', 'B+ Tree requires less memory than any other data structure', 'B+ Tree has O(1) point lookup time', 'B', 'MEDIUM', 1, 'B+ Trees store all actual record pointers in doubly-linked leaf nodes, enabling efficient range scans, whereas Hash indexes only support equality lookups.'),
(4, 'A database index that physically dictates the order of data storage on disk is known as a:', 'Non-clustered Index', 'Clustered Index', 'Composite Index', 'Bitmap Index', 'B', 'EASY', 1, 'A Clustered Index alters the physical storage layout of the table rows on disk to match the index key order.'),
(4, 'Why might a database query planner choose a sequential table scan instead of using an existing B+ tree index?', 'When the table has more than 100 rows', 'When the query condition has low selectivity and matches a large percentage of total rows in the table', 'When the database engine runs out of transaction logs', 'When foreign key constraints are disabled', 'B', 'HARD', 1, 'When a predicate matches a high proportion of rows (low selectivity), the random disk I/O of reading index pages plus heap pages is slower than a sequential scan.');

-- TOPIC 5: OOP Concepts & Principles (Java)

INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(5, 'Which OOP principle is implemented in Java by making class fields private and providing public getter/setter methods?', 'Polymorphism', 'Encapsulation', 'Inheritance', 'Abstraction', 'B', 'EASY', 1, 'Encapsulation bundles data and the methods operating on that data, restricting direct access via access modifiers.'),
(5, 'In Java, what is the key difference between Method Overloading and Method Overriding?', 'Overloading happens at runtime; Overriding happens at compile-time', 'Overloading occurs within the same class with different method signatures; Overriding occurs in a subclass with identical signature', 'Overloading requires the @Override annotation', 'Overriding requires differing return types', 'B', 'EASY', 1, 'Overloading is compile-time polymorphism within a class with varied parameter lists, whereas overriding is runtime polymorphism in a subclass.'),
(5, 'Can an abstract class in Java have constructors?', 'No, abstract classes cannot declare constructors because they cannot be instantiated directly', 'Yes, abstract classes can declare constructors to initialize fields when a subclass instance is instantiated via super()', 'Only if the constructor is declared as private', 'Only if the constructor is static', 'B', 'MEDIUM', 1, 'Abstract classes can have constructors, which are invoked during subclass instantiation to properly initialize base class state.'),
(5, 'According to the Liskov Substitution Principle (LSP) in SOLID design, what must be true?', 'Subclasses must provide completely different public APIs than their parent classes', 'Objects of a superclass should be replaceable with objects of its subclasses without breaking program correctness', 'Interfaces should contain as many default methods as possible', 'A class should only have one reason to change', 'B', 'HARD', 1, 'LSP states that derived types must be completely substitutable for their base types without altering desirable program properties.');

-- TOPIC 6: Collections Framework (Java)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(6, 'Which Java Collection interface allows duplicate elements and maintains insertion order?', 'Set', 'List', 'Map', 'TreeSet', 'B', 'EASY', 1, 'List is an ordered collection that permits duplicate elements and provides index-based access.'),
(6, 'What is the default initial capacity and load factor of a standard Java HashMap?', 'Capacity 10, Load Factor 0.5', 'Capacity 16, Load Factor 0.75', 'Capacity 32, Load Factor 0.8', 'Capacity 8, Load Factor 1.0', 'B', 'MEDIUM', 1, 'Java HashMap initializes with an array capacity of 16 and a load factor of 0.75 by default.'),
(6, 'In Java 8+, how does HashMap handle high collision buckets where many keys hash to the same index?', 'It throws a ConcurrentModificationException', 'It transitions the linked list into a Red-Black Tree once the bucket exceeds TREEIFY_THRESHOLD (8)', 'It discards the older duplicate keys', 'It increases table capacity without reorganizing existing buckets', 'B', 'HARD', 1, 'When a bucket contains 8 or more entries and the table is sufficiently large, HashMap transforms the bucket list into a balanced Red-Black tree (TreeNode) to improve worst-case lookup from O(n) to O(log n).');

-- TOPIC 7: Exception Handling (Java)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(7, 'Which of the following is an unchecked exception in Java?', 'IOException', 'SQLException', 'NullPointerException', 'ClassNotFoundException', 'C', 'EASY', 1, 'NullPointerException extends RuntimeException and is therefore an unchecked exception.'),
(7, 'Under what rare condition will a finally block NOT execute in Java?', 'When an uncaught RuntimeException is thrown inside the try block', 'When System.exit(0) is invoked or the JVM crashes', 'When the try block contains a return statement', 'When an OutOfMemoryError is logged', 'B', 'MEDIUM', 1, 'A finally block always runs unless the JVM halts abnormally, such as via System.exit(int) or an OS termination signal.'),
(7, 'In Java''s try-with-resources statement, what interface must the declared resource implement?', 'java.lang.Cloneable', 'java.lang.AutoCloseable', 'java.io.Serializable', 'java.util.Observer', 'B', 'HARD', 1, 'Any resource managed by try-with-resources must implement java.lang.AutoCloseable (or java.io.Closeable).');

-- TOPIC 8: Multithreading & Concurrency (Java)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(8, 'What is the effect of declaring a variable with the ''volatile'' keyword in Java?', 'It guarantees atomic operations on 64-bit integers and doubles', 'It guarantees visibility of changes to other threads by forcing reads/writes directly to main memory and preventing instruction reordering', 'It locks the entire class during variable access', 'It prevents garbage collection of the variable', 'B', 'MEDIUM', 1, 'Volatile establishes a happens-before relationship ensuring memory visibility across threads, though it does not provide compound atomicity like synchronized blocks.'),
(8, 'What state does a Java Thread enter when it calls Object.wait()?', 'TIMED_WAITING', 'WAITING', 'BLOCKED', 'TERMINATED', 'B', 'EASY', 1, 'Calling wait() without a timeout causes the thread to release its monitor and enter the WAITING state until notified.'),
(8, 'Why is ConcurrentHashMap in Java generally preferred over Collections.synchronizedMap() in multi-threaded applications?', 'ConcurrentHashMap locks the entire map during all read and write calls', 'ConcurrentHashMap uses fine-grained segment/bucket locking permitting concurrent reads without blocking and parallel writes', 'ConcurrentHashMap allows null keys and values', 'ConcurrentHashMap runs on GPU cores', 'B', 'HARD', 1, 'ConcurrentHashMap achieves high throughput via bucket-level synchronization and lock-free reads, whereas Collections.synchronizedMap locks the entire object for all operations.');

-- TOPIC 9: Arrays & Dynamic Arrays (Data Structures)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(9, 'What is the time complexity of accessing an element in an array by its index?', 'O(n)', 'O(1)', 'O(log n)', 'O(n^2)', 'B', 'EASY', 1, 'Array indexing uses direct base memory address plus offset arithmetic, yielding O(1) constant time access.'),
(9, 'When a dynamic array (like ArrayList) exhausts its capacity and resizes, what is its amortized time complexity for append operations?', 'O(n)', 'O(1)', 'O(log n)', 'O(n log n)', 'B', 'MEDIUM', 1, 'While individual resize operations take O(n), geometric array doubling ensures the amortized cost per append is O(1).'),
(9, 'In the Two-Pointer technique for finding a pair of numbers with target sum in a sorted array, what happens when current sum < target?', 'Move right pointer leftward', 'Move left pointer rightward', 'Reset both pointers to array middle', 'Multiply current elements', 'B', 'MEDIUM', 1, 'Since the array is sorted, incrementing the left pointer moves to a larger value, increasing the running sum toward target.');

-- TOPIC 10: Linked Lists (Data Structures)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(10, 'Which algorithm detects a cycle in a singly linked list in O(n) time and O(1) auxiliary space?', 'Dijkstra''s Algorithm', 'Floyd''s Tortoise and Hare Cycle Finding Algorithm', 'Kruskal''s Algorithm', 'Binary Search', 'B', 'EASY', 1, 'Floyd''s algorithm uses slow and fast pointers to reliably detect circular references in linked nodes with constant memory.'),
(10, 'What is the time complexity of reversing a singly linked list of n nodes iteratively?', 'O(n^2) time and O(n) space', 'O(n) time and O(1) space', 'O(log n) time and O(1) space', 'O(n log n) time and O(n) space', 'B', 'MEDIUM', 1, 'Iterative reversal updates pointers node-by-node in a single O(n) linear pass using constant O(1) auxiliary references.'),
(10, 'In an LRU (Least Recently Used) cache implementation, which pair of data structures provides O(1) get and put operations?', 'Binary Search Tree and Stack', 'Doubly Linked List and Hash Map', 'Queue and Array', 'Heap and Red-Black Tree', 'B', 'HARD', 1, 'A Hash Map provides O(1) key-to-node lookup, while a Doubly Linked List enables O(1) removal and head-insertion of most-recently-accessed nodes.');

-- TOPIC 11: Stacks & Queues (Data Structures)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(11, 'Which data structure follows the Last In, First Out (LIFO) operational principle?', 'Queue', 'Stack', 'Linked List', 'Priority Queue', 'B', 'EASY', 1, 'Stacks operate strictly on LIFO principles where the most recently pushed item is the first popped.'),
(11, 'Which data structure is primarily used to evaluate arithmetic expressions written in Postfix notation?', 'Queue', 'Stack', 'Binary Tree', 'Graph', 'B', 'MEDIUM', 1, 'Operands are pushed onto a stack and operators pop two operands, compute the result, and push it back.'),
(11, 'How can you implement a Queue using two Stacks (S1 for enqueue, S2 for dequeue) with amortized O(1) time per operation?', 'S1 pops on every dequeue; S2 is never used', 'Enqueue pushes to S1; Dequeue pops from S2; if S2 is empty, transfer all elements from S1 to S2', 'Transfer elements back and forth on every single push and pop', 'Sort S1 on every operation', 'B', 'HARD', 1, 'Each element is moved from S1 to S2 at most once, providing amortized O(1) operations for both push and pop.');

-- TOPIC 12: Trees & Binary Search Trees (Data Structures)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(12, 'Which tree traversal visits the nodes in the order: Left Subtree, Root, Right Subtree?', 'Preorder', 'Inorder', 'Postorder', 'Level-order', 'B', 'EASY', 1, 'Inorder traversal visits left child, current node, then right child; on a BST, this produces values in strictly sorted ascending order.'),
(12, 'What is the maximum number of nodes on level k (where root is level 0) of a binary tree?', 'k^2', '2^k', '2^(k+1) - 1', 'k!', 'B', 'MEDIUM', 1, 'At each level, each node can branch into at most 2 children, giving 2^k maximum nodes at level k.'),
(12, 'What is the balance factor of a node in an AVL tree, and what is its valid range for every node?', 'Height(Left) - Height(Right); must be in {-1, 0, 1}', 'Nodes(Left) - Nodes(Right); must be in {0, 1}', 'Depth(Left) + Depth(Right); must be in {0, 2}', 'Degree(Node); must be <= 2', 'A', 'HARD', 1, 'An AVL tree is strictly self-balancing; the height difference between left and right subtrees of any node cannot exceed 1.');

-- TOPIC 13: Process Management & Threads (Operating Systems)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(13, 'What operating system data structure contains all information needed to manage an individual process (PID, state, registers, memory maps)?', 'TLB', 'Process Control Block (PCB)', 'File Allocation Table (FAT)', 'Inode Table', 'B', 'EASY', 1, 'The PCB (Process Control Block) maintains complete execution state, accounting, and resource pointers for a process.'),
(13, 'What is the primary difference between a process and a thread?', 'Processes share memory space; threads have isolated memory spaces', 'Processes have independent address spaces; threads within the same process share code, data, and open files', 'Threads cannot be scheduled by the OS', 'Processes require less overhead to create than threads', 'B', 'MEDIUM', 1, 'Threads within a process share the same virtual address space and heap, making context switching and thread creation much lighter than process creation.'),
(13, 'What are the four necessary and sufficient conditions for a Deadlock to occur in an operating system?', 'Paging, Segmentation, Swapping, Fragmentation', 'Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait', 'SJF, FCFS, Priority, Round Robin', 'Race condition, Critical section, Semaphore, Spinlock', 'B', 'HARD', 1, 'Coffman conditions: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait must all hold simultaneously for deadlock.');

-- TOPIC 14: CPU Scheduling Algorithms (Operating Systems)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(14, 'Which CPU scheduling algorithm assigns a fixed time quantum to each ready process in cyclic order?', 'First Come First Served (FCFS)', 'Round Robin (RR)', 'Shortest Job First (SJF)', 'Multilevel Queue', 'B', 'EASY', 1, 'Round Robin assigns each process a fixed slice of time (quantum), preempting it if execution exceeds the slice.'),
(14, 'What scheduling issue occurs in non-preemptive Shortest Job First (SJF) when long processes wait indefinitely for CPU time?', 'Deadlock', 'Starvation (Indefinite Blocking)', 'Convoy Effect', 'Thrashing', 'B', 'MEDIUM', 1, 'Starvation occurs when a stream of shorter processes continuously preempts or precedes longer jobs in the queue.'),
(14, 'The phenomenon in FCFS scheduling where a CPU-bound process holds the CPU while multiple I/O-bound processes wait behind it is known as:', 'Priority Inversion', 'Convoy Effect', 'Belady''s Anomaly', 'Thrashing', 'B', 'HARD', 1, 'The Convoy Effect results in poor CPU and device utilization as smaller I/O processes queue behind one giant CPU-bound process.');

-- TOPIC 15: Memory Management & Paging (Operating Systems)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(15, 'What hardware cache is used by the MMU to accelerate virtual-to-physical address translation?', 'L1 Instruction Cache', 'Translation Lookaside Buffer (TLB)', 'Instruction Register', 'Disk Buffer', 'B', 'EASY', 1, 'The TLB is a high-speed associative hardware cache holding recent virtual page number to physical frame translations.'),
(15, 'What is Belady''s Anomaly in operating systems page replacement algorithms?', 'Allocating more memory frames to a process can sometimes cause an increase in total page faults under FIFO', 'Allocating more CPU time causes memory fragmentation', 'LRU algorithm causes thrashing', 'Virtual memory fails when swap space is half empty', 'A', 'MEDIUM', 1, 'Belady''s Anomaly proves that under FIFO page replacement, adding more physical memory frames can counterintuitively increase the total number of page faults.'),
(15, 'What is Thrashing in virtual memory management?', 'A high CPU utilization state during matrix computation', 'A state where the operating system spends more time swapping pages in and out of disk than executing useful user instructions', 'A hardware memory parity failure', 'The fragmentation of internal heap pointers', 'B', 'HARD', 1, 'Thrashing occurs when the sum of active process working sets exceeds physical RAM, causing continuous page faults and disk thrashing.');

-- TOPIC 16: OSI & TCP/IP Models (Computer Networks)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(16, 'At which layer of the OSI model do Routers primarily operate?', 'Physical Layer (Layer 1)', 'Data Link Layer (Layer 2)', 'Network Layer (Layer 3)', 'Transport Layer (Layer 4)', 'C', 'EASY', 1, 'Routers inspect destination IP addresses and operate at the Network Layer (Layer 3).'),
(16, 'What is the primary protocol data unit (PDU) name at the Transport Layer of the OSI model?', 'Bits', 'Frames', 'Packets', 'Segments (or Datagrams for UDP)', 'D', 'MEDIUM', 1, 'PDUs are: Layer 1: Bits, Layer 2: Frames, Layer 3: Packets, Layer 4: Segments.');

-- TOPIC 17: IP Addressing & Subnetting (Computer Networks)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(17, 'How many usable host IP addresses are available in a standard /24 IPv4 subnet?', '256', '254', '255', '128', 'B', 'EASY', 1, 'A /24 subnet has 2^8 = 256 addresses; subtracting the Network address and Broadcast address leaves 254 usable host IPs.'),
(17, 'What is the broadcast address for the subnet 192.168.10.0/26?', '192.168.10.255', '192.168.10.63', '192.168.10.127', '192.168.10.64', 'B', 'MEDIUM', 1, 'A /26 mask has block size of 64 (256-192=64). The range is 192.168.10.0 to 192.168.10.63, where .63 is the broadcast address.');

-- TOPIC 18: Transport Layer (TCP & UDP) (Computer Networks)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(18, 'Which TCP control flags are exchanged during the initial three-way handshake connection establishment?', 'ACK, FIN, ACK', 'SYN, SYN-ACK, ACK', 'RST, SYN, ACK', 'URG, PSH, ACK', 'B', 'EASY', 1, 'Client sends SYN; Server responds with SYN-ACK; Client replies with ACK to establish connection.'),
(18, 'What mechanism does TCP use to detect packet loss without waiting for retransmission timer expiration?', 'Slow Start Threshold', 'Fast Retransmit triggered by 3 duplicate ACKs', 'Nagle''s Algorithm', 'Checksum verification', 'B', 'HARD', 1, 'When a sender receives three duplicate acknowledgments for the same sequence number, it immediately retransmits the missing segment (Fast Retransmit).');

-- TOPIC 19: SDLC & Agile Methodologies (Software Engineering)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(19, 'What is the typical duration of a Sprint in the Agile Scrum framework?', '6 months to 1 year', '1 to 4 weeks', '1 day', 'Continuous with no iterations', 'B', 'EASY', 1, 'Scrum sprints are fixed timeboxes typically spanning 1 to 4 weeks (most commonly 2 weeks).'),
(19, 'In Scrum, who is primarily accountable for maximizing the business value of the product and managing the Product Backlog?', 'Scrum Master', 'Product Owner', 'Development Team Lead', 'Chief Architect', 'B', 'MEDIUM', 1, 'The Product Owner owns backlog prioritization and value delivery.');

-- TOPIC 20: Design Patterns (Software Engineering)
INSERT INTO questions (topic_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, marks, explanation) VALUES
(20, 'Which design pattern ensures a class has only one instance and provides a global access point to it?', 'Factory Method', 'Singleton Pattern', 'Observer Pattern', 'Decorator Pattern', 'B', 'EASY', 1, 'The Singleton pattern restricts class instantiation to a single object across the entire application lifecycle.'),
(20, 'Which design pattern defines a one-to-many dependency between objects so that when one object changes state, all dependents are notified automatically?', 'Strategy Pattern', 'Observer Pattern', 'Adapter Pattern', 'Command Pattern', 'B', 'MEDIUM', 1, 'The Observer pattern allows subscribers to listen and automatically react to state changes in a subject/publisher.'),
(20, 'Which structural design pattern attaches additional responsibilities and behaviors to an object dynamically without modifying its underlying code?', 'Singleton', 'Decorator Pattern', 'Factory', 'Facade', 'B', 'HARD', 1, 'The Decorator pattern wraps an existing class to provide enhanced behavior dynamically, adhering to the Open-Closed Principle.');

-- Reset sequences to prevent key collision on subsequent inserts
SELECT setval('users_user_id_seq', (SELECT COALESCE(MAX(user_id), 1) FROM users));
SELECT setval('subjects_subject_id_seq', (SELECT COALESCE(MAX(subject_id), 1) FROM subjects));
SELECT setval('topics_topic_id_seq', (SELECT COALESCE(MAX(topic_id), 1) FROM topics));
SELECT setval('questions_question_id_seq', (SELECT COALESCE(MAX(question_id), 1) FROM questions));
SELECT setval('quiz_attempts_attempt_id_seq', (SELECT COALESCE(MAX(attempt_id), 1) FROM quiz_attempts));
SELECT setval('performance_performance_id_seq', (SELECT COALESCE(MAX(performance_id), 1) FROM performance));
