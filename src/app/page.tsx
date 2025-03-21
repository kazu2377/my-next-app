"use client";
import { useEffect, useMemo, useState } from "react";

// インターフェース定義
interface Problem {
  id: number;
  question: string;
  description: string;
  solution: string;
  hints: string[];
  relatedTables: string[];
  expectedPattern: RegExp;
}

interface DatabaseSchema {
  [key: string]: string;
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

interface SchemaTableProps {
  tableName: string;
  schema: string;
}

interface ResultMessageProps {
  result: {
    correct: boolean;
    message: string;
  } | null;
}

interface Stats {
  correct: number;
  incorrect: number;
  skipped: number;
}

// コードエディタコンポーネント
const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange }) => {
  return (
    <div className="relative border border-gray-300 dark:border-gray-700 rounded-md">
      <div className="absolute top-0 right-0 bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs rounded-bl-md rounded-tr-md font-mono text-gray-700 dark:text-gray-300">
        SQL
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 rounded-md font-mono text-sm h-48 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="ここにSQLクエリを入力してください..."
      />
    </div>
  );
};

// テーブル構造を表示するコンポーネント
const SchemaTable: React.FC<SchemaTableProps> = ({ tableName, schema }) => {
  return (
    <div className="mb-4 overflow-hidden rounded border border-gray-200 dark:border-gray-700">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 font-medium text-gray-700 dark:text-gray-300">
        {tableName}
      </div>
      <pre className="bg-white dark:bg-gray-900 p-3 text-xs font-mono overflow-x-auto text-gray-800 dark:text-gray-300">
        {schema}
      </pre>
    </div>
  );
};

// 結果表示コンポーネント
const ResultMessage: React.FC<ResultMessageProps> = ({ result }) => {
  if (!result) return null;

  const bgColor = result.correct ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900";
  const textColor = result.correct
    ? "text-green-800 dark:text-green-200"
    : "text-red-800 dark:text-red-200";
  const borderColor = result.correct
    ? "border-green-200 dark:border-green-800"
    : "border-red-200 dark:border-red-800";

  return (
    <div className={`p-4 mb-4 rounded-md border ${borderColor} ${bgColor}`}>
      <p className={`text-sm font-medium ${textColor}`}>{result.message}</p>
    </div>
  );
};

const SQLPracticeApp: React.FC = () => {
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">(
    "beginner"
  );
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [result, setResult] = useState<{ correct: boolean; message: string } | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [stats, setStats] = useState<Stats>({
    correct: 0,
    incorrect: 0,
    skipped: 0,
  });
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // SQLite テーブル定義
  const databaseSchema: DatabaseSchema = {
    employees: `
      CREATE TABLE employees (
        employee_id INTEGER PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone_number TEXT,
        hire_date TEXT,
        job_id TEXT,
        salary REAL,
        commission_pct REAL,
        manager_id INTEGER,
        department_id INTEGER
      );
    `,
    departments: `
      CREATE TABLE departments (
        department_id INTEGER PRIMARY KEY,
        department_name TEXT,
        manager_id INTEGER,
        location_id INTEGER
      );
    `,
    customers: `
      CREATE TABLE customers (
        customer_id INTEGER PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip_code TEXT,
        registration_date TEXT
      );
    `,
    orders: `
      CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY,
        customer_id INTEGER,
        order_date TEXT,
        total_amount REAL,
        status TEXT,
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
      );
    `,
    products: `
      CREATE TABLE products (
        product_id INTEGER PRIMARY KEY,
        name TEXT,
        description TEXT,
        price REAL,
        category TEXT,
        stock_quantity INTEGER
      );
    `,
    order_items: `
      CREATE TABLE order_items (
        item_id INTEGER PRIMARY KEY,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        unit_price REAL,
        FOREIGN KEY (order_id) REFERENCES orders (order_id),
        FOREIGN KEY (product_id) REFERENCES products (product_id)
      );
    `,
  };

  // SQL問題データをuseMemoで最適化
  const allProblems = useMemo(
    () => ({
      beginner: [
        {
          id: 1,
          question: "全ての従業員(employees)のfirst_nameとlast_nameを取得してください。",
          description: "従業員テーブルから名前と苗字を選択するSELECT文を書いてください。",
          solution: "SELECT first_name, last_name FROM employees;",
          hints: ["SELECT句で取得したいカラムを指定します", "FROM句でテーブルを指定します"],
          relatedTables: ["employees"],
          expectedPattern: /SELECT\s+first_name\s*,\s*last_name\s+FROM\s+employees\s*;?/i,
        },
        {
          id: 2,
          question: "給与(salary)が5000以上の従業員の全情報を取得してください。",
          description: "条件に合致する従業員レコードをフィルタリングするクエリを書いてください。",
          solution: "SELECT * FROM employees WHERE salary >= 5000;",
          hints: ["WHERE句で条件を指定します", ">=演算子を使って5000以上をフィルタリングします"],
          relatedTables: ["employees"],
          expectedPattern: /SELECT\s+\*\s+FROM\s+employees\s+WHERE\s+salary\s*>=\s*5000\s*;?/i,
        },
        {
          id: 3,
          question: "従業員を給与(salary)の高い順に並べ替えて、全情報を取得してください。",
          description:
            "従業員テーブルから全カラムを取得し、給与で降順に並べ替えるクエリを書いてください。",
          solution: "SELECT * FROM employees ORDER BY salary DESC;",
          hints: ["ORDER BY句を使って並べ替えます", "DESC修飾子で降順に指定します"],
          relatedTables: ["employees"],
          expectedPattern: /SELECT\s+\*\s+FROM\s+employees\s+ORDER\s+BY\s+salary\s+DESC\s*;?/i,
        },
        {
          id: 4,
          question: "全ての部門(departments)の名前(department_name)を取得してください。",
          description: "部門テーブルから部門名だけを選択するクエリを書いてください。",
          solution: "SELECT department_name FROM departments;",
          hints: ["SELECT句には必要なカラムだけを指定します"],
          relatedTables: ["departments"],
          expectedPattern: /SELECT\s+department_name\s+FROM\s+departments\s*;?/i,
        },
        {
          id: 5,
          question: "全ての商品(products)の名前(name)と価格(price)を取得してください。",
          description: "商品テーブルから商品名と価格を取得するクエリを書いてください。",
          solution: "SELECT name, price FROM products;",
          hints: ["複数のカラムを取得するにはカンマで区切ります"],
          relatedTables: ["products"],
          expectedPattern: /SELECT\s+name\s*,\s*price\s+FROM\s+products\s*;?/i,
        },
        {
          id: 6,
          question: "在庫数(stock_quantity)が10未満の商品(products)を取得してください。",
          description: "条件を使って在庫が少ない商品をフィルタリングするクエリを書いてください。",
          solution: "SELECT * FROM products WHERE stock_quantity < 10;",
          hints: ["WHERE句で条件を指定します", "<演算子を使って10未満をフィルタリングします"],
          relatedTables: ["products"],
          expectedPattern: /SELECT\s+\*\s+FROM\s+products\s+WHERE\s+stock_quantity\s*<\s*10\s*;?/i,
        },
        {
          id: 7,
          question: "顧客(customers)の名前(name)と市区町村(city)を取得してください。",
          description: "顧客テーブルから名前と市区町村だけを取得するクエリを書いてください。",
          solution: "SELECT name, city FROM customers;",
          hints: ["必要なカラムのみをSELECT句に指定します"],
          relatedTables: ["customers"],
          expectedPattern: /SELECT\s+name\s*,\s*city\s+FROM\s+customers\s*;?/i,
        },
        {
          id: 8,
          question: "注文(orders)を注文日(order_date)の新しい順に並べ替えて取得してください。",
          description: "注文テーブルから全データを日付の降順でソートするクエリを書いてください。",
          solution: "SELECT * FROM orders ORDER BY order_date DESC;",
          hints: ["ORDER BY句を使って並べ替えます", "日付の降順にするにはDESCを使います"],
          relatedTables: ["orders"],
          expectedPattern: /SELECT\s+\*\s+FROM\s+orders\s+ORDER\s+BY\s+order_date\s+DESC\s*;?/i,
        },
        {
          id: 9,
          question: "ステータス(status)が「完了」の注文(orders)を取得してください。",
          description:
            "特定のステータス値を持つ注文だけをフィルタリングするクエリを書いてください。",
          solution: "SELECT * FROM orders WHERE status = 'completed';",
          hints: [
            "文字列の条件指定には引用符を使います",
            "statusカラムと「completed」値を比較します",
          ],
          relatedTables: ["orders"],
          expectedPattern:
            /SELECT\s+\*\s+FROM\s+orders\s+WHERE\s+status\s*=\s*['"]completed['"]s*;?/i,
        },
        {
          id: 10,
          question: "注文明細(order_items)の合計金額(単価×数量)を取得してください。",
          description: "注文明細テーブルから計算フィールドを含むクエリを書いてください。",
          solution:
            "SELECT item_id, order_id, unit_price * quantity AS total_amount FROM order_items;",
          hints: [
            "計算式を直接SELECT句に書くことができます",
            "AS句を使って計算結果に名前を付けられます",
          ],
          relatedTables: ["order_items"],
          expectedPattern:
            /SELECT\s+.*\s*unit_price\s*\*\s*quantity\s+AS\s+total_amount\s+.*\s+FROM\s+order_items\s*;?/i,
        },
      ],
      intermediate: [
        {
          id: 11,
          question:
            "各部門(departments)の従業員数を部門名(department_name)と共に取得してください。",
          description: "GROUP BY句を使って部門ごとの従業員数を集計するクエリを書いてください。",
          solution: `
          SELECT d.department_name, COUNT(e.employee_id) AS employee_count
          FROM departments d
          LEFT JOIN employees e ON d.department_id = e.department_id
          GROUP BY d.department_name;
        `,
          hints: [
            "JOINを使って部門と従業員を結合します",
            "COUNT関数で従業員数を集計します",
            "GROUP BYで部門ごとにグループ化します",
          ],
          relatedTables: ["departments", "employees"],
          expectedPattern:
            /SELECT\s+d\.department_name\s*,\s*COUNT\s*\(\s*.*\s*\)\s+.*\s+FROM\s+departments\s+.*\s+JOIN\s+employees\s+.*\s+GROUP\s+BY\s+.*department_name\s*;?/i,
        },
        {
          id: 12,
          question: "平均給与(salary)が部門平均を上回る従業員(employees)を取得してください。",
          description:
            "サブクエリを使って部門平均給与より高い給与の従業員を特定するクエリを書いてください。",
          solution: `
          SELECT e1.employee_id, e1.first_name, e1.last_name, e1.salary, e1.department_id
          FROM employees e1
          WHERE e1.salary > (
            SELECT AVG(e2.salary)
            FROM employees e2
            WHERE e2.department_id = e1.department_id
          );
        `,
          hints: [
            "サブクエリで各部門の平均給与を計算します",
            "WHEREで従業員の給与と部門平均を比較します",
          ],
          relatedTables: ["employees"],
          expectedPattern:
            /SELECT\s+.*\s+FROM\s+employees\s+.*\s+WHERE\s+.*salary\s*>\s*\(\s*SELECT\s+AVG\s*\(\s*salary\s*\)\s+FROM\s+employees\s+.*\s*\)\s*;?/i,
        },
        {
          id: 13,
          question:
            "過去30日間の注文(orders)と各注文に関連する顧客(customers)情報を取得してください。",
          description:
            "JOIN句と日付関数を使って最近の注文と顧客情報を結合するクエリを書いてください。",
          solution: `
          SELECT o.order_id, o.order_date, c.name AS customer_name, c.email
          FROM orders o
          JOIN customers c ON o.customer_id = c.customer_id
          WHERE o.order_date >= date('now', '-30 days');
        `,
          hints: ["JOINで注文と顧客テーブルを結合します", "日付関数で過去30日間の条件を指定します"],
          relatedTables: ["orders", "customers"],
          expectedPattern:
            /SELECT\s+.*\s+FROM\s+orders\s+.*\s+JOIN\s+customers\s+.*\s+WHERE\s+.*order_date\s*>=\s*.*-30\s*.*\s*;?/i,
        },
        {
          id: 14,
          question: "各カテゴリごとに最も高価な商品(products)を取得してください。",
          description:
            "GROUP BY句とサブクエリを使って各カテゴリの最高価格商品を特定するクエリを書いてください。",
          solution: `
          SELECT p1.*
          FROM products p1
          JOIN (
            SELECT category, MAX(price) as max_price
            FROM products
            GROUP BY category
          ) p2 ON p1.category = p2.category AND p1.price = p2.max_price;
        `,
          hints: [
            "サブクエリでカテゴリごとの最高価格を集計します",
            "JOINで元のテーブルと結合して最高価格の商品を特定します",
          ],
          relatedTables: ["products"],
          expectedPattern:
            /SELECT\s+.*\s+FROM\s+products\s+.*\s+JOIN\s+\(\s*SELECT\s+category\s*,\s*MAX\s*\(\s*price\s*\)\s+.*\s+GROUP\s+BY\s+category\s*\)\s+.*\s+ON\s+.*\s*;?/i,
        },
        {
          id: 15,
          question:
            "部署名(department_name)とその部署のマネージャーの名前(first_name, last_name)を取得してください。",
          description: "複数テーブルの結合を含むクエリを書いてください。",
          solution: `
          SELECT d.department_name, e.first_name, e.last_name
          FROM departments d
          LEFT JOIN employees e ON d.manager_id = e.employee_id;
        `,
          hints: [
            "LEFT JOINで部署テーブルとマネージャー情報を結合します",
            "マネージャーがいない部署もすべて表示するようにします",
          ],
          relatedTables: ["departments", "employees"],
          expectedPattern:
            /SELECT\s+.*department_name\s*,\s*.*first_name\s*,\s*.*last_name\s+FROM\s+departments\s+.*\s+JOIN\s+employees\s+.*\s+ON\s+.*manager_id\s*=\s*.*employee_id\s*;?/i,
        },
        {
          id: 16,
          question: "各顧客(customers)の総注文金額を計算し、金額の高い順に取得してください。",
          description:
            "テーブル結合と集計関数を使用して顧客ごとの注文合計を計算するクエリを書いてください。",
          solution: `
          SELECT c.customer_id, c.name, SUM(o.total_amount) AS total_spent
          FROM customers c
          LEFT JOIN orders o ON c.customer_id = o.customer_id
          GROUP BY c.customer_id, c.name
          ORDER BY total_spent DESC;
        `,
          hints: [
            "LEFT JOINで顧客と注文を結合します",
            "SUM関数で合計金額を計算します",
            "GROUP BYで顧客ごとにグループ化します",
          ],
          relatedTables: ["customers", "orders"],
          expectedPattern:
            /SELECT\s+.*\s+FROM\s+customers\s+.*\s+JOIN\s+orders\s+.*\s+GROUP\s+BY\s+.*\s+ORDER\s+BY\s+.*\s+DESC\s*;?/i,
        },
        {
          id: 17,
          question: "注文(orders)数が5件以上ある顧客(customers)を取得してください。",
          description: "HAVING句を使って注文数で顧客をフィルタリングするクエリを書いてください。",
          solution: `
          SELECT c.customer_id, c.name, COUNT(o.order_id) AS order_count
          FROM customers c
          JOIN orders o ON c.customer_id = o.customer_id
          GROUP BY c.customer_id, c.name
          HAVING COUNT(o.order_id) >= 5;
        `,
          hints: [
            "GROUP BYで顧客ごとにグループ化します",
            "HAVING句で注文数5件以上の条件を指定します",
          ],
          relatedTables: ["customers", "orders"],
          expectedPattern:
            /SELECT\s+.*\s+FROM\s+customers\s+.*\s+JOIN\s+orders\s+.*\s+GROUP\s+BY\s+.*\s+HAVING\s+COUNT\s*\(\s*.*\s*\)\s*>=\s*5\s*;?/i,
        },
        {
          id: 18,
          question: "商品(products)ごとの総売上金額を計算してください。",
          description:
            "複数テーブルの結合と集計関数を使って商品別の売上を計算するクエリを書いてください。",
          solution: `
          SELECT p.product_id, p.name, SUM(oi.quantity * oi.unit_price) AS total_revenue
          FROM products p
          LEFT JOIN order_items oi ON p.product_id = oi.product_id
          GROUP BY p.product_id, p.name;
        `,
          hints: [
            "LEFT JOINで商品と注文明細を結合します",
            "数量と単価を掛けて合計することで売上金額を計算します",
          ],
          relatedTables: ["products", "order_items"],
          expectedPattern:
            /SELECT\s+.*\s+FROM\s+products\s+.*\s+JOIN\s+order_items\s+.*\s+GROUP\s+BY\s+.*\s*;?/i,
        },
        {
          id: 19,
          question: "同じ部署(department_id)に属する従業員(employees)のリストを取得してください。",
          description: "SELFジョインを使って同じ部署の従業員を検索するクエリを書いてください。",
          solution: `
          SELECT e1.employee_id, e1.first_name, e1.last_name, e1.department_id,
                 e2.employee_id AS colleague_id, e2.first_name AS colleague_first_name, e2.last_name AS colleague_last_name
          FROM employees e1
          JOIN employees e2 ON e1.department_id = e2.department_id AND e1.employee_id <> e2.employee_id;
        `,
          hints: [
            "同じテーブルをSELFジョインするために異なるエイリアスを使います",
            "自分自身を除外するために条件を追加します",
          ],
          relatedTables: ["employees"],
          expectedPattern:
            /SELECT\s+.*\s+FROM\s+employees\s+.*\s+JOIN\s+employees\s+.*\s+ON\s+.*department_id\s*=\s*.*department_id\s+AND\s+.*employee_id\s*<>\s*.*employee_id\s*;?/i,
        },
        {
          id: 20,
          question: "注文(orders)がない顧客(customers)を取得してください。",
          description: "外部結合と存在確認を使って注文がない顧客を特定するクエリを書いてください。",
          solution: `
          SELECT c.*
          FROM customers c
          LEFT JOIN orders o ON c.customer_id = o.customer_id
          WHERE o.order_id IS NULL;
        `,
          hints: [
            "LEFT JOINと条件でNULLチェックを組み合わせます",
            "WHERE句でorder_idがNULLの顧客を抽出します",
          ],
          relatedTables: ["customers", "orders"],
          expectedPattern:
            /SELECT\s+.*\s+FROM\s+customers\s+.*\s+LEFT\s+JOIN\s+orders\s+.*\s+WHERE\s+.*order_id\s+IS\s+NULL\s*;?/i,
        },
      ],
      advanced: [
        {
          id: 21,
          question: "各月ごとの注文(orders)数と売上合計を取得してください。",
          description: "日付関数と集計を組み合わせて月次レポートを生成するクエリを書いてください。",
          solution: `
          SELECT strftime('%Y-%m', order_date) AS month,
                 COUNT(*) AS order_count,
                 SUM(total_amount) AS monthly_revenue
          FROM orders
          GROUP BY strftime('%Y-%m', order_date)
          ORDER BY month;
        `,
          hints: [
            "strftime関数で日付から年月を抽出します",
            "GROUP BYで月ごとにグループ化して集計します",
          ],
          relatedTables: ["orders"],
          expectedPattern:
            /SELECT\s+.*\('%Y-%m',\s+order_date\)\s+.*\s+COUNT\s*\(\s*.*\s*\)\s+.*\s+SUM\s*\(\s*total_amount\s*\)\s+.*\s+FROM\s+orders\s+GROUP\s+BY\s+.*\s+ORDER\s+BY\s+.*\s*;?/i,
        },
        {
          id: 22,
          question: "過去3ヶ月の月別売上を前年同月と比較してください。",
          description: "複雑なサブクエリと日付計算を使って年次比較を行うクエリを書いてください。",
          solution: `
          SELECT current.month,
                 current.revenue AS current_year_revenue,
                 previous.revenue AS previous_year_revenue,
                 (current.revenue - previous.revenue) AS revenue_difference,
                 CASE 
                   WHEN previous.revenue > 0 THEN ROUND((current.revenue - previous.revenue) * 100.0 / previous.revenue, 2)
                   ELSE NULL
                 END AS percentage_change
          FROM (
            SELECT strftime('%m', order_date) AS month,
                   SUM(total_amount) AS revenue
            FROM orders
            WHERE order_date >= date('now', '-3 months')
            GROUP BY strftime('%m', order_date)
          ) current
          LEFT JOIN (
            SELECT strftime('%m', order_date) AS month,
                   SUM(total_amount) AS revenue
            FROM orders
            WHERE order_date >= date('now', '-1 year', '-3 months')
              AND order_date <= date('now', '-1 year')
            GROUP BY strftime('%m', order_date)
          ) previous ON current.month = previous.month
          ORDER BY current.month;
        `,
          hints: [
            "複数のサブクエリで当年と前年のデータを集計します",
            "JOINで同じ月のデータを結合します",
            "CASE式で増減率を計算します",
          ],
          relatedTables: ["orders"],
          expectedPattern:
            /SELECT\s+.*\s+FROM\s+\(\s*SELECT\s+.*order_date\)\s+.*\s+FROM\s+orders\s+WHERE\s+.*\s+GROUP\s+BY\s+.*\s*\)\s+.*\s+JOIN\s+\(\s*SELECT\s+.*\s+FROM\s+orders\s+WHERE\s+.*\s+GROUP\s+BY\s+.*\s*\)\s+.*\s+ON\s+.*\s+ORDER\s+BY\s+.*\s*;?/i,
        },
      ],
    }),
    []
  ); // 依存配列は空で良い（静的なデータ）

  // 難易度に応じた問題をランダムに選ぶ
  useEffect(() => {
    if (difficulty) {
      const availableProblems = [...allProblems[difficulty]];
      // 配列をシャッフル
      const shuffled = availableProblems.sort(() => 0.5 - Math.random());
      // 10問選択
      setProblems(shuffled.slice(0, 10));
      setCurrentProblemIndex(0);
      setUserAnswer("");
      setResult(null);
      setShowSolution(false);
      // 統計情報をリセット
      setStats({
        correct: 0,
        incorrect: 0,
        skipped: 0,
      });
    }
  }, [difficulty, allProblems]);

  // 回答を検証する関数
  const checkAnswer = () => {
    const currentProblem = problems[currentProblemIndex];
    // 正規表現パターンにマッチするかチェック
    const isCorrect = currentProblem.expectedPattern.test(userAnswer.trim());

    setResult({
      correct: isCorrect,
      message: isCorrect ? "正解です！" : "不正解です。もう一度試すか、解答を確認してください。",
    });

    // 統計を更新
    if (isCorrect) {
      setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  // 次の問題に進む
  const nextProblem = () => {
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex((prev) => prev + 1);
      setUserAnswer("");
      setResult(null);
      setShowSolution(false);
    }
  };

  // 前の問題に戻る
  const prevProblem = () => {
    if (currentProblemIndex > 0) {
      setCurrentProblemIndex((prev) => prev - 1);
      setUserAnswer("");
      setResult(null);
      setShowSolution(false);
    }
  };

  // 問題をスキップ
  const skipProblem = () => {
    setStats((prev) => ({ ...prev, skipped: prev.skipped + 1 }));
    nextProblem();
  };

  // 解答を表示/非表示
  const toggleSolution = () => {
    setShowSolution((prev) => !prev);
  };

  // 現在の問題を取得
  const currentProblem = problems.length > 0 ? problems[currentProblemIndex] : null;

  // 進捗率を計算
  const progressPercentage =
    problems.length > 0 ? ((currentProblemIndex + 1) / problems.length) * 100 : 0;

  // ダークモード切り替え
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="container mx-auto p-4 max-w-4xl">
        {/* ヘッダー */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            SQLクエリ検証アプリ
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>

        {/* 難易度選択 */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
            難易度を選択:
          </h2>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md ${
                difficulty === "beginner"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setDifficulty("beginner")}
            >
              初級
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                difficulty === "intermediate"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setDifficulty("intermediate")}
            >
              中級
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                difficulty === "advanced"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setDifficulty("advanced")}
            >
              上級
            </button>
          </div>
        </div>

        {/* 進捗バー */}
        {problems.length > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs mt-1 text-gray-600 dark:text-gray-400">
              <span>
                問題 {currentProblemIndex + 1} / {problems.length}
              </span>
              <span>
                正解率: {stats.correct}/{stats.correct + stats.incorrect} (
                {stats.correct + stats.incorrect > 0
                  ? Math.round((stats.correct / (stats.correct + stats.incorrect)) * 100)
                  : 0}
                %)
              </span>
            </div>
          </div>
        )}

        {/* 問題表示エリア */}
        {currentProblem && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
              問題 {currentProblemIndex + 1}
            </h3>
            <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
              {currentProblem.question}
            </p>
            <p className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              {currentProblem.description}
            </p>

            {/* 関連テーブルの表示 */}
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">
                関連テーブル:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentProblem.relatedTables.map((tableName) => (
                  <SchemaTable
                    key={tableName}
                    tableName={tableName}
                    schema={databaseSchema[tableName]}
                  />
                ))}
              </div>
            </div>

            {/* ヒント表示 */}
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">ヒント:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400">
                {currentProblem.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>

            {/* SQLエディタ */}
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">
                SQLクエリを入力:
              </h4>
              <CodeEditor value={userAnswer} onChange={setUserAnswer} />
            </div>

            {/* 結果表示 */}
            <ResultMessage result={result} />

            {/* 解答表示 */}
            {showSolution && (
              <div className="mb-4">
                <h4 className="text-md font-medium mb-2 text-gray-700 dark:text-gray-300">
                  解答例:
                </h4>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                  <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-300">
                    {currentProblem.solution}
                  </pre>
                </div>
              </div>
            )}

            {/* アクションボタン */}
            <div className="flex flex-wrap gap-2 mt-6">
              <button
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
                className={`px-4 py-2 rounded-md ${
                  !userAnswer.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                回答を確認
              </button>
              <button
                onClick={toggleSolution}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                {showSolution ? "解答を隠す" : "解答を表示"}
              </button>
              <button
                onClick={skipProblem}
                className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                スキップ
              </button>
            </div>
          </div>
        )}

        {/* ナビゲーションボタン */}
        {problems.length > 0 && (
          <div className="flex justify-between">
            <button
              onClick={prevProblem}
              disabled={currentProblemIndex === 0}
              className={`px-4 py-2 rounded-md ${
                currentProblemIndex === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              前の問題
            </button>
            <button
              onClick={nextProblem}
              disabled={currentProblemIndex === problems.length - 1}
              className={`px-4 py-2 rounded-md ${
                currentProblemIndex === problems.length - 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              次の問題
            </button>
          </div>
        )}

        {/* フッター */}
        <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2025 SQLクエリ検証アプリ - SQLの学習をサポート</p>
        </div>
      </div>
    </div>
  );
};

export default SQLPracticeApp;
