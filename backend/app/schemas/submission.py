from typing import Optional, List, Any
from pydantic import BaseModel, Field

class TestCaseSchema(BaseModel):
    input: str
    expected: Any
    description: Optional[str] = None

class CodeRunRequest(BaseModel):
    problemId: str
    language: str
    code: str
    testCases: Optional[List[TestCaseSchema]] = None

class CodeSubmitRequest(BaseModel):
    problemId: str
    language: str
    code: str

class FailingCaseSchema(BaseModel):
    input: str
    expected: Any
    actual: Any
    description: Optional[str] = None

class SubmissionResponse(BaseModel):
    token: str
    status: str
    verdict: str
    stdout: Optional[str] = None
    stderr: Optional[str] = None
    compileOutput: Optional[str] = None
    timeMs: Optional[int] = None
    memoryKb: Optional[int] = None
    totalCases: int = 0
    passedCases: int = 0
    failingCase: Optional[FailingCaseSchema] = None
