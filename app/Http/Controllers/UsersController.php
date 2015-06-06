<?php namespace SomethingGoodHappenedToday\Http\Controllers;

use SomethingGoodHappenedToday\Http\Controllers\Controller;
use SomethingGoodHappenedToday\Repositories\UserRepository;

class UsersController extends Controller
{

    /**
     * @var UserRepository
     */
    private $repository;

    public function __construct(UserRepository $repository){

        $this->repository = $repository;
    }

    public function index()
    {
        return $this->repository->getAll();
    }

    public function show($id)
    {
        return $this->repository->show($id);
    }
}
