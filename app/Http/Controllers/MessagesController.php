<?php

namespace SomethingGoodHappenedToday\Http\Controllers;

use SomethingGoodHappenedToday\Http\Controllers\Controller;
use SomethingGoodHappenedToday\Repositories\MessageRepository;

class MessagesController extends Controller
{

    /**
     * @var MessageRepository
     */
    private $repository;

    public function __construct(MessageRepository $repository){

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
